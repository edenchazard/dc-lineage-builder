FROM node:lts-alpine3.14
RUN npm install --global @vue/cli
WORKDIR /app
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
COPY ./src/frontend/package*.json ./
RUN npm install
CMD ["npm", "run", "serve"]