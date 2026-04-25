FROM nginx:alpine

# Descargar marked.js en tiempo de build para no depender del CDN en runtime
RUN apk add --no-cache wget && \
    wget -q -O /tmp/marked.min.js \
         "https://cdn.jsdelivr.net/npm/marked@15/marked.min.js"

WORKDIR /code
COPY . /code

# Colocar marked junto al resto de assets JS
RUN cp /tmp/marked.min.js /code/assets/js/marked.min.js

RUN rm -rf /usr/share/nginx/html/*
RUN cp -r /code/* /usr/share/nginx/html/