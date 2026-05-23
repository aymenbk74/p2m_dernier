pipeline {
    triggers {
        githubPush()
    }    
    agent any
    stages {
        stage('Checkout') { steps { checkout scm } }

        stage('Build & Deploy') {
            steps {
                // 1. Force environment variables
                sh 'echo "VITE_API_BASE_URL=http://host.docker.internal:8000" > frontend/.env'
                
                // 2. Overwrite any 'localhost' in your config file to ensure no mix-ups
                sh "sed -i 's|localhost:8000|host.docker.internal:8000|g' frontend/src/config.js || true"
                
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // 3. IMPORTANT: --no-cache ensures Vite re-bundles with the new URL
                sh 'docker build --no-cache -t p2m_dernier-frontend:latest ./frontend'
                
                sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'

                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
                    string(credentialsId: 'K8S_TOKEN', variable: 'K8S_TOKEN')
                ]) {
                    // Using double quotes inside single quotes ensures bash handles the variable securely
                    sh 'mkdir -p server && cp "$SECRET_ENV" server/.env'
                    
                    script {
                        // Escaping the $ prevents insecure Groovy interpolation. Bash will handle the token.
                        def k8sCmd = "kubectl --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify --token=\$K8S_TOKEN"
                        
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Restarting deployments..."
                        sh "${k8sCmd} rollout restart deployment frontend"
                        sh "${k8sCmd} rollout restart deployment backend"
                        
                        sh "${k8sCmd} rollout status deployment/frontend --timeout=90s"
                        sh "${k8sCmd} rollout status deployment/backend --timeout=90s"
                        
                        sleep 10
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                script {
                    echo "Checking frontend availability..."
                    sh "timeout 60s bash -c 'until curl -s http://host.docker.internal:3000 > /dev/null; do echo \"Waiting...\"; sleep 2; done'"
                }
                // Increased timeout to 90s for slower environments
                sh '''
                    docker run --name e2e_test_container \
                    -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 \
                    --add-host=host.docker.internal:host-gateway \
                    p2m_playwright_image npx playwright test auth.spec.js --timeout 90000
                '''
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker rm e2e_test_container || true'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'frontend/test-results/**/*', allowEmptyArchive: true
            
            // Re-inject the token credential so the post-action can successfully fetch logs
            withCredentials([
                string(credentialsId: 'K8S_TOKEN', variable: 'K8S_TOKEN')
            ]) {
                script {
                    def k8sCmd = "kubectl --server=https://host.docker.internal:6443 --insecure-skip-tls-verify --token=\$K8S_TOKEN"
                    echo "--- FINAL BACKEND LOGS ---"
                    sh "${k8sCmd} logs -l tier=backend --tail=50 || true"
                }
            }
        }
    }
}