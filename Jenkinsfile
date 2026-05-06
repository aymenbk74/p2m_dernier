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
                // Use BOTH the .env file and the Kubeconfig file from Jenkins Credentials
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
                    file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')
                ]) {
                    sh 'mkdir -p server && cp $SECRET_ENV server/.env'
                    
                    script {
                        // Use the path provided by Jenkins for the uploaded kubeconfig
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"

                        echo "Applying Kubernetes manifests..."
                        sh "${k8sCmd} apply -f k8s/ --validate=false"
                        
                        echo "Waiting for pods to be ready..."
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=database --timeout=90s"
                        sh "${k8sCmd} wait --for=condition=ready pod -l tier=backend --timeout=90s"
                    }
                }
            }
        }

        stage('E2E Test') {
            steps {
                sh 'sleep 10'
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
            // Check if Kubeconfig was available to clean up
            script {
                try {
                    withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')]) {
                        def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                        sh "${k8sCmd} delete -f k8s/ --ignore-not-found"
                        sh "${k8sCmd} delete pvc postgres-pvc --ignore-not-found"
                    }
                } catch (e) {
                    echo "Cleanup failed or Kubeconfig not found: ${e.message}"
                }
            }
            cleanWs()
        }
    }
}