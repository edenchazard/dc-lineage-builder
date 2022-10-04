FROM node:lts-alpine
WORKDIR /app
ENV NODE_ENV=development
COPY ./package*.json ./
RUN npm install

ENTRYPOINT ["npm", "run", "dev"]