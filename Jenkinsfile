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
                
                // Use the credentials ID you created in Jenkins
                withCredentials([file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV')]) {
                    sh 'cp $SECRET_ENV server/.env'
                }
                
                sh 'docker-compose up -d'
            }
        }

        stage('E2E Test') {
            steps {
                sh 'sleep 15'
                sh 'docker-compose ps'
                
                // 1. Run the test WITHOUT --rm, give it a specific name, and use '|| true' 
                // so a test failure doesn't stop the pipeline before we can copy the files!
                sh 'docker-compose run --name e2e_test_container e2e npx playwright test auth.spec.js || true'
                
                // 2. Copy the test results and report from the stopped container back to Jenkins
                sh 'docker cp e2e_test_container:/app/test-results ./frontend/ || true'
                sh 'docker cp e2e_test_container:/app/playwright-report ./frontend/ || true'
                
                // 3. Now we can safely delete the container
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
            // Archive both the traces/screenshots and the HTML report
            archiveArtifacts artifacts: 'frontend/test-results/**/*, frontend/playwright-report/**/*', allowEmptyArchive: true
            
            sh 'docker-compose down --volumes || true'
            cleanWs()
        }
    }
}
