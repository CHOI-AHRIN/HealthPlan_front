#!/usr/bin/env bash

# 개발환경
# docker build --no-cache -t localhost:8443/hpf-app .
# docker push localhost:8443/hpf-app
# docker-compose up -d

# ------------------------------------------------------

# 운영환경
docker build --no-cache -t 192.168.1.10:8443/hpf-app .
docker push 192.168.1.10:8443/hpf-app

# 이미지 빌드 이후 순차적으로 실행
# kubectl apply -f deployment.yaml
# kubectl apply -f service.yaml