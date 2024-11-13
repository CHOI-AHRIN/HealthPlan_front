#!/usr/bin/env bash
docker build --no-cache -t localhost:8443/hpf-app .
docker push localhost:8443/hpf-app
docker-compose up -d
#kubectl apply -f deployment.yaml
#kubectl apply -f service.yaml
