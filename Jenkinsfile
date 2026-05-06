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
                // Build Backend
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // Build Frontend - passing the URL so the browser knows where to find the API
                sh 'docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 -t p2m_dernier-frontend:latest ./frontend'
                
                // Build E2E image if not already built
                sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'
            }
        }

        stage('Deploy to K8s') {
            steps {
                // This block takes the .env file you uploaded to Jenkins and puts it in the workspace
                withCredentials([file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV')]) {
                    sh 'mkdir -p server && cp $SECRET_ENV server/.env'
                }

                // Apply all K8s manifests
                // --validate=false helps skip the login-redirection error we saw earlier
                sh 'kubectl apply -f k8s/ --validate=false'
                
                // Wait for services to be ready
                echo "Waiting for pods to be ready..."
                sh 'kubectl wait --for=condition=ready pod -l tier=database --timeout=90s'
                sh 'kubectl wait --for=condition=ready pod -l tier=backend --timeout=90s'
            }
        }

        stage('E2E Test') {
            steps {
                // Give the frontend an extra moment to settle
                sh 'sleep 10'
                
                // Run Playwright container using host network to see the LoadBalancers on localhost
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
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            
            // Cleanup: Destroy the K8s resources and the volume
            sh 'kubectl delete -f k8s/ --ignore-not-found'
            sh 'kubectl delete pvc postgres-pvc --ignore-not-found'
            cleanWs()
        }
    }
}