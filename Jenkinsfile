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
                
                // Just run the test command! No bash or npm install needed here.
                sh 'docker-compose run --rm e2e npx playwright test auth.spec.js'
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
            // 1. Save the Playwright screenshots and traces so you can download them!
            archiveArtifacts artifacts: 'frontend/test-results/**/*', allowEmptyArchive: true
            
            // 2. Shut down docker
            sh 'docker-compose down --volumes || true'
            
            // 3. Clean up
            cleanWs()
        }
    }
}
