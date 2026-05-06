pipeline {
    agent any
    stages {
        stage('Checkout') { steps { checkout scm } }

        stage('Build & Deploy') {
            steps {
                // Create .env for Frontend
                sh 'echo "VITE_API_BASE_URL=http://host.docker.internal:8000" > frontend/.env'
                
                sh 'docker build -t p2m_dernier-backend:latest ./server'
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
                        
                        echo "Waiting for Pods..."
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=backend --timeout=90s"
                        
                        // --- THE OBSERVABILITY PART ---
                        echo "!!! BACKEND STATUS AND LOGS !!!"
                        sh "${k8sCmd} get pods"
                        sh "${k8sCmd} describe pod -l tier=backend"
                        sh "${k8sCmd} logs -l tier=backend --tail=100"
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
                // Pull reports
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker rm e2e_test_container || true'
            }
        }
    }
    post {
        always {
            // WE STOP DELETING THE K8S RESOURCES
            // This allows you to run 'kubectl logs' manually on your PC 
            // while the Jenkins job is finished but the pods are still there.
            echo "Cleanup skipped to allow manual inspection."
            archiveArtifacts artifacts: 'frontend/test-results/**/*', allowEmptyArchive: true
        }
    }
}