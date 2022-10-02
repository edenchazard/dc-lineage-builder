FROM node:lts-alpine3.14
WORKDIR /app
ENV NODE_ENV=development
ENV VUE_APP_URL=/
ENV CHOKIDAR_USEPOLLING=true
RUN npm install --global @vue/cli
COPY ./package*.json ./
RUN npm install

ENTRYPOINT ["npm", "run", "serve"]