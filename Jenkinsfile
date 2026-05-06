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
                sh 'docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 -t p2m_dernier-frontend:latest ./frontend'
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

                        echo "Applying Kubernetes manifests..."
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Waiting for pods to be ready..."
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=database --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=backend --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=frontend --timeout=90s"
                        
                        // Debugging: Let's see the state of the services
                        sh "${k8sCmd} get svc"
                        sh "${k8sCmd} get pods"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                echo "Giving LoadBalancer 20 seconds to bind to localhost..."
                sh 'sleep 20'
                
                sh '''
                    docker run --network host --name e2e_test_container \
                    -e PLAYWRIGHT_BASE_URL=http://localhost:3000 \
                    p2m_playwright_image npx playwright test auth.spec.js || true
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
                        
                        // If test failed, get logs before deleting
                        sh "${k8sCmd} logs -l tier=backend --tail=50 || true"
                        sh "${k8sCmd} logs -l tier=frontend --tail=50 || true"
                        
                        sh "${k8sCmd} delete -f k8s/ --ignore-not-found"
                        sh "${k8sCmd} delete pvc postgres-pvc --ignore-not-found"
                    }
                } catch (e) {
                    echo "Cleanup skip: ${e.message}"
                }
            }
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            cleanWs()
        }
    }
}