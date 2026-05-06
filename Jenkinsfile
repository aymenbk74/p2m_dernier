stage('Build & Deploy') {
    steps {
        // Force a fresh build by creating a unique file
        sh 'date > frontend/build-timestamp.txt'
        
        sh 'docker build -t p2m_dernier-backend:latest ./server'
        
        // Use --no-cache and ensure we are in the right context
        sh 'docker build --no-cache -t p2m_dernier-frontend:latest ./frontend'
        
        sh 'docker build -t p2m_playwright_image -f frontend/Dockerfile.e2e ./frontend'

        withCredentials([
            file(credentialsId: 'backend-env-file', variable: 'SECRET_ENV'),
            file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_PATH')
        ]) {
            sh 'mkdir -p server && cp $SECRET_ENV server/.env'
            script {
                def k8sCmd = "kubectl --kubeconfig=${KUBECONFIG_PATH} --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify"
                
                echo "Applying K8s Manifests..."
                sh "${k8sCmd} apply -f k8s/ --validate=false"
                
                // RESTART THE DEPLOYMENTS to ensure they use the brand new images
                sh "${k8sCmd} rollout restart deployment frontend"
                sh "${k8sCmd} rollout restart deployment backend"
                
                sh "${k8sCmd} wait --for=condition=available deployment/frontend --timeout=90s"
                sh "${k8sCmd} wait --for=condition=available deployment/backend --timeout=90s"
            }
        }
    }
}