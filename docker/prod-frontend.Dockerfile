FROM node:lts-alpine3.14 as build
RUN npm install --global @vue/cli
ARG VUE_APP_URL
ENV VUE_APP_URL=$VUE_APP_URL
ARG VUE_APP_VERSION
ENV VUE_APP_VERSION=$VUE_APP_VERSION
WORKDIR /app
COPY ./src/frontend/package*.json ./
RUN npm install
COPY ./src/frontend ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/dist /var/www/html
COPY ./docker/prod-nginx.conf /etc/nginx/conf.d/default.conf