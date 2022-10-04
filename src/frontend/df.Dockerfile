FROM node:lts-alpine3.14
WORKDIR /app
ENV NODE_ENV=development
ENV VITE_APP_URL=/
COPY ./package*.json ./
RUN npm install

ENTRYPOINT ["npm", "run", "serve"]