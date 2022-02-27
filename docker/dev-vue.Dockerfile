FROM node:lts-alpine3.14
WORKDIR /app
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
COPY package*.json ./
RUN npm install
RUN npm install -g @vue/cli
ENTRYPOINT ["npm", "run", "serve"]