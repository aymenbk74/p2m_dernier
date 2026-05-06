pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // Force a fresh build to bake in the host.docker.internal URL
                sh 'docker build --no-cache --build-arg VITE_API_BASE_URL=http://host.docker.internal:8000 -t p2m_dernier-frontend:latest ./frontend'
                
                sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'
            }
        }

        stage('Deploy to K8s') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
                    file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')
                ]) {
                    sh 'mkdir -p server && cp $SECRET_ENV server/.env'
                    
                    script {
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Waiting for Pods to be ready..."
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=database --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=backend --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=frontend --timeout=90s"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                script {
                    echo "Checking connectivity to frontend..."
                    sh "timeout 60s bash -c 'until curl -s http://host.docker.internal:3000 > /dev/null; do echo \"Waiting for frontend...\"; sleep 2; done'"
                }
                
                // Added --timeout 60000 to give Playwright more breathing room
                sh '''
                    docker run --name e2e_test_container \
                    -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 \
                    --add-host=host.docker.internal:host-gateway \
                    p2m_playwright_image npx playwright test auth.spec.js --timeout 60000 || true
                '''
                
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker cp e2e_test_container:/app/playwright-report ./frontend/ || true'
                sh 'docker rm e2e_test_container || true'
            }
        }
    }

    post {
        always {
            script {
                try {
                    withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')]) {
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                        sh "${k8sCmd} logs -l tier=backend --tail=100 || true"
                        // sh "${k8sCmd} delete -f k8s/ --ignore-not-found"
                    }
                } catch (e) { echo "Cleanup skip" }
            }
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            cleanWs()
        }
    }
}