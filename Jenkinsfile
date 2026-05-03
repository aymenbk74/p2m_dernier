pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Test') {
            steps {
                sh 'mkdir -p server'
                withCredentials([file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV')]) {
                    sh 'cp $SECRET_ENV server/.env'
                }
                
                // Start all services including pgAdmin
                sh 'docker-compose up -d db backend frontend pgadmin'
                
                sh 'sleep 20' 
                
                sh 'docker-compose logs backend'
                sh 'docker-compose ps'
            }
        }

        stage('Data Inspection - Check pgAdmin') {
            steps {
                // Display connection info
                sh '''
                    echo "========================================="
                    echo "pgAdmin is now available!"
                    echo "URL: http://localhost:5050"
                    echo "Email: admin@admin.com"
                    echo "Password: admin"
                    echo ""
                    echo "Once logged in, add a server with:"
                    echo "  - Name: p2m_ecommerce"
                    echo "  - Host: p2m_db"
                    echo "  - Port: 5432"
                    echo "  - Database: p2m_ecommerce"
                    echo "  - Username: postgres"
                    echo "  - Password: postgres"
                    echo "========================================="
                '''
                
                // Pause pipeline - services stay running
                input message: 'Check pgAdmin at http://localhost:5050. Click "Proceed" when done inspecting.'
            }
        }

        stage('E2E Test') {
            steps {
                sh 'sleep 15'
                sh 'docker-compose ps'
                
                sh 'docker-compose run --name e2e_test_container e2e npx playwright test auth.spec.js || true'
                
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker cp e2e_test_container:/app/playwright-report ./frontend/ || true'
                
                sh 'docker rm e2e_test_container || true'
            }
        }

        stage('Push') {
            when {
                branch 'main'
            }
            steps {
                echo 'Push step: Add your registry push commands here'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            
            sh 'docker-compose down --volumes || true'
            cleanWs()
        }
    }
}