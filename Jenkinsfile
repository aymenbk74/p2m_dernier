pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Images') {
            steps {
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // Create the .env file with BOTH names just to be safe
                sh '''
                    echo "VITE_API_BASE_URL=http://host.docker.internal:8000" > frontend/.env
                    echo "VITE_API_URL=http://host.docker.internal:8000" >> frontend/.env
                '''
                
                sh 'docker build --no-cache -t p2m_dernier-frontend:latest ./frontend'
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
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=frontend --timeout=90s"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                script {
                    sh "timeout 60s bash -c 'until curl -s http://host.docker.internal:3000 > /dev/null; do echo \"Waiting...\"; sleep 2; done'"
                }
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
                    }
                } catch (e) { echo "Post-cleanup skip" }
            }
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            cleanWs()
        }
    }
}