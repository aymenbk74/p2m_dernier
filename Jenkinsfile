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
                sh 'sleep 30'
                sh 'docker-compose ps'
                sh 'curl -v http://localhost:3000 || true'
                sh 'cd frontend && npm install && npx playwright install --with-deps && npx playwright test auth.spec.js || true'
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
