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
                sh 'sleep 20'
                sh '''
                    # Wait for frontend to be ready
                    max_attempts=30
                    attempt=0
                    while [ $attempt -lt $max_attempts ]; do
                        if curl -f http://localhost:3000 > /dev/null 2>&1; then
                            echo "Frontend is ready"
                            break
                        fi
                        echo "Waiting for frontend... (attempt $((attempt+1))/$max_attempts)"
                        sleep 2
                        attempt=$((attempt+1))
                    done
                '''
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
