pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                // 1. Force a clean state for the Frontend
                sh 'rm -f frontend/.env'
                sh 'echo "VITE_API_BASE_URL=http://host.docker.internal:8000" > frontend/.env'
                sh 'echo "VITE_API_URL=http://host.docker.internal:8000" >> frontend/.env'
                
                // 2. Build Backend
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // 3. Build Frontend (forcing no-cache so it picks up the .env)
                sh 'docker build --no-cache -t p2m_dernier-frontend:latest ./frontend'
                
                // 4. Build E2E Test Image
                sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'

                // 5. Kubernetes Deployment
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
                    file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')
                ]) {
                    sh 'mkdir -p server && cp $SECRET_ENV server/.env'
                    
                    script {
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                        
                        echo "Applying K8s Manifests..."
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Forcing Kubernetes to use the new images..."
                        sh "${k8sCmd} rollout restart deployment frontend"
                        sh "${k8sCmd} rollout restart deployment backend"
                        
                        echo "Waiting for pods to stabilize..."
                        sh "${k8sCmd} wait --for=condition=available deployment/frontend --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=available deployment/backend --timeout=90s"
                        
                        echo "!!! CURRENT BACKEND LOGS !!!"
                        sh "${k8sCmd} logs -l tier=backend --tail=20"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                script {
                    echo "Checking connectivity to frontend..."
                    sh "timeout 60s bash -c 'until curl -s http://host.docker.internal:3000 > /dev/null; do echo \"Waiting...\"; sleep 2; done'"
                }
                
                sh '''
                    docker run --name e2e_test_container \
                    -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 \
                    --add-host=host.docker.internal:host-gateway \
                    p2m_playwright_image npx playwright test auth.spec.js --timeout 60000 || true
                '''
                
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker rm e2e_test_container || true'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'frontend/test-results/**/*', allowEmptyArchive: true
            echo "Build finished. Pods left running for inspection."
        }
    }
}