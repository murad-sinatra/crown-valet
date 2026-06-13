#!/bin/bash
 
# deploy.sh — pull latest code and rebuild containers
# Place in your repo root and run directly on crown-valet
 
set -e
 
echo "Deploying..."
git pull
docker compose -f docker-compose.prod.yml up --build  -d
echo "Done!"
