FROM nginx:alpine

# limpiar default
RUN rm -rf /usr/share/nginx/html/*

# copiar build de Angular
COPY dist/quiz-angular /usr/share/nginx/html

# nginx config para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]