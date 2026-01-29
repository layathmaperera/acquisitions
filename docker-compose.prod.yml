version: '3.8'

services:
  # Application Service for Production
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: acquisition-app-prod
    ports:
      - '3000:3000'
    env_file:
      - .env.production
    networks:
      - acquisition-production
    restart: unless-stopped
    healthcheck:
      test:
        [
          'CMD',
          'node',
          '-e',
          "const http = require('http'); const req = http.request({hostname: 'localhost', port: 3000, path: '/health'}, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); req.on('error', () => process.exit(1)); req.end();",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'

networks:
  acquisition-production:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
# Optional: External networks for production deployments
# networks:
#   acquisition-production:
#     external: true