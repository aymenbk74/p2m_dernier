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
                // Wait briefly for React to finish building inside the container
                sh 'sleep 15'
                sh 'docker-compose ps'
                
                // Run the tests inside the dedicated Playwright container
                // We use 'run --rm' so the container deletes itself after finishing
                sh 'docker-compose run --rm e2e /bin/bash -c "npm install && npx playwright test auth.spec.js"'
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
            sh 'docker-compose down --volumes || true'
            cleanWs()
        }
    }
}
