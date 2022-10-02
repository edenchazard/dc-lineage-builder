FROM node:lts-alpine3.14 as build
WORKDIR /app
ARG MOUNT_PATH
ENV VUE_APP_URL=$MOUNT_PATH
RUN npm install --global @vue/cli
COPY ./ ./
RUN npm ci && npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/dist /var/www/html
COPY --from=build /app/nginx-prod.conf /etc/nginx/conf.d/default.conf