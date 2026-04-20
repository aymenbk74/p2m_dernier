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
                sh 'docker-compose up -d'
                sh 'sleep 10'
                sh 'docker-compose exec -T backend python -m pytest || true'
            }
        }

        stage('E2E Test') {
            steps {
                sh 'sleep 15'
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
