FROM nginx:alpine

# Копируем готовую папку dist
COPY dist /usr/share/nginx/html

# Если хочешь, чтобы Nginx слушал 9001, меняем конфиг
RUN sed -i 's/listen       80;/listen       9001;/' /etc/nginx/conf.d/default.conf

EXPOSE 9001
