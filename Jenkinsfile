// Stessa metodologia del progetto Laravel: usa Docker da /tmp se presente (server Jenkins :8081)
pipeline {
    agent any
    stages {

        stage('Get env vars') {
            steps {
                script {
                    sh 'git rev-parse HEAD > git_commit_id.txt'
                    try {
                        env.GIT_COMMIT_ID = readFile('git_commit_id.txt').trim()
                        env.GIT_SHA = env.GIT_COMMIT_ID.substring(0, 7)
                    } catch (e) {
                        error "${e}"
                    }
                    env.DOCKER_IMAGE = "doc-website:${env.GIT_SHA}"
                    println "DOCKER_IMAGE ==> ${env.DOCKER_IMAGE}"
                }
            }
        }

        stage('Build Docker image') {
            steps {
                sh """
                    export PATH="/tmp:\$PATH"
                    if [ -f /tmp/docker ]; then
                        /tmp/docker build --rm -t ${env.DOCKER_IMAGE} -f .deploy/build/Dockerfile .
                    else
                        docker build --rm -t ${env.DOCKER_IMAGE} -f .deploy/build/Dockerfile .
                    fi
                """
            }
        }

        stage('Deploy') {
            steps {
                dir('.deploy') {
                    script {
                        input message: 'Deploy doc.polisportivacastelvieto.it?', ok: 'Deploy'
                        sh '''
                            export PATH="/tmp:$PATH"
                            export DOCKER_IMAGE=''' + env.DOCKER_IMAGE + '''
                            export COMPOSE_PROJECT_NAME=doc-website
                            export HEALTHCHECK_INTERVAL=${HEALTHCHECK_INTERVAL:-40s}
                            export HEALTHCHECK_TIMEOUT=${HEALTHCHECK_TIMEOUT:-10s}
                            if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
                                COMPOSE_CMD="docker compose"
                            elif command -v docker-compose >/dev/null 2>&1; then
                                COMPOSE_CMD="docker-compose"
                            else
                                echo "ERROR: Neither docker compose nor docker-compose available"
                                exit 1
                            fi
                            $COMPOSE_CMD -f docker-compose.yml --profile app up -d app
                        '''
                        echo "Deploy completed. Waiting for healthcheck..."
                        sleep 10
                        sh '''
                            export PATH="/tmp:$PATH"
                            export DOCKER_IMAGE=''' + env.DOCKER_IMAGE + '''
                            CONTAINER=$(docker ps -q -f ancestor=''' + env.DOCKER_IMAGE + ''' | head -1)
                            if [ -n "$CONTAINER" ]; then
                                CODE=$(docker exec $CONTAINER wget -q -O /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")
                                echo "Application HTTP response: $CODE"
                                if [ "$CODE" != "200" ] && [ "$CODE" != "301" ] && [ "$CODE" != "302" ]; then
                                    echo "WARNING: Expected 200, got $CODE"
                                fi
                            fi
                        '''
                    }
                }
            }
        }
    }
}
