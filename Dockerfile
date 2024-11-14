# 1. 빌드 단계
FROM node:14 AS build

# 2. 소스코드 
RUN git clone https://github.com/CHOI-AHRIN/HealthPlan_front.git

# 작업 디렉터리 설정
WORKDIR /HealthPlan_front/client

# npm 설치 및 빌드
RUN npm install
RUN npm run build

# 캐시 무효화를 위해 환경 변수를 사용하여 빌드 시점에 항상 새 값이 설정되도록 함
ARG CACHE_BUST=1
RUN npm install

# 애플리케이션 소스 복사
#COPY . .

# 2. 배포 단계
FROM nginx:alpine

# Nginx 설정 파일 제거 및 빌드된 파일 복사
COPY --from=build /HealthPlan_front/client/build /usr/share/nginx/html

# proxy 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 서버 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

