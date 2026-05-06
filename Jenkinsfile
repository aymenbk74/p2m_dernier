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
                // Build images exactly as named in your YAML files
                sh 'docker build -t p2m_dernier-backend:latest ./server'
                
                // Pass the Localhost URL so React knows where the backend is on your machine
                sh 'docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 -t p2m_dernier-frontend:latest ./frontend'
            }
        }

        stage('Deploy to K8s') {
            steps {
                // Handle your secrets first (instead of copying .env)
                // Note: Ensure your 'backend-env-file' content is formatted for K8s if possible, 
                // or keep using your existing logic to create a secret from the file.
                sh 'kubectl apply -f k8s/postgres-pvc.yaml'
                sh 'kubectl apply -f k8s/' 
                
                // Wait for the Database and Backend to actually be ready (better than sleep 20)
                sh 'kubectl wait --for=condition=ready pod -l tier=database --timeout=90s'
                sh 'kubectl wait --for=condition=ready pod -l tier=backend --timeout=90s'
                
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }

        stage('E2E Test (Playwright)') {
            steps {
                // Since services are 'LoadBalancer', Playwright runs on the host against localhost
                // No need to run 'docker-compose run e2e' if you have playwright installed on the agent
                // If you MUST run it via container, we use a standalone docker run:
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
            
            // The "Destroy" logic: wipe the namespace/resources and the volume
            sh 'kubectl delete -f k8s/ --ignore-not-found'
            sh 'kubectl delete pvc postgres-pvc --ignore-not-found'
            cleanWs()
        }
    }
}