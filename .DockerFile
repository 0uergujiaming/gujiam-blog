FROM nginx:latest

# 配置端口和域名的环境变量
ENV NGINX_PORT=80 NGINX_DOMAIN=localhost

COPY default.conf /etc/nginx/templates/default.conf.template
COPY dist/ /usr/share/nginx/html/
