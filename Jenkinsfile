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
                sh 'echo "VITE_API_BASE_URL=http://host.docker.internal:8000" > frontend/.env'
                
                // Manual overwrite of the config file to be 100% sure
                sh '''
                    sed -i "s|localhost:8000|host.docker.internal:8000|g" frontend/src/config.js || true
                '''
                
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // IMPORTANT: --no-cache is mandatory here to force Vite to re-bundle
                sh 'docker build --no-cache -t p2m_dernier-frontend:latest ./frontend'
                
                sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'

                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
                    file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')
                ]) {
                    sh 'mkdir -p server && cp $SECRET_ENV server/.env'
                    
                    script {
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                        
                        echo "Applying K8s Manifests..."
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Restarting deployments to pick up new images..."
                        sh "${k8sCmd} rollout restart deployment frontend"
                        sh "${k8sCmd} rollout restart deployment backend"
                        
                        // Wait for the new pods to be fully created and the old ones to die
                        echo "Waiting for pods to reach 'Ready' status..."
                        sh "${k8sCmd} rollout status deployment/frontend --timeout=90s"
                        sh "${k8sCmd} rollout status deployment/backend --timeout=90s"
                        
                        // Safety buffer for the python/node processes to start inside the pods
                        sleep 10
                        
                        echo "Check pod status after rollout:"
                        sh "${k8sCmd} get pods"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                script {
                    echo "Checking if Frontend is reachable at http://host.docker.internal:3000..."
                    sh "timeout 60s bash -c 'until curl -s http://host.docker.internal:3000 > /dev/null; do echo \"Waiting for frontend...\"; sleep 2; done'"
                }
                
                // Run Playwright
                sh '''
                    docker run --name e2e_test_container \
                    -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 \
                    --add-host=host.docker.internal:host-gateway \
                    p2m_playwright_image npx playwright test auth.spec.js --timeout 60000 || true
                '''
                
                // Extract results
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker rm e2e_test_container || true'
            }
        }
    }

    post {
        always {
            // Archive screenshots/traces
            archiveArtifacts artifacts: 'frontend/test-results/**/*', allowEmptyArchive: true
            
            // Final Log dump - this is where we will see the POST /signup logs!
            script {
                if (env.KUBECONFIG_PATH) {
                    def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                    echo "--- FINAL BACKEND LOGS ---"
                    sh "${k8sCmd} logs -l tier=backend --tail=50 || echo 'Could not fetch logs'"
                }
            }
        }
    }
}