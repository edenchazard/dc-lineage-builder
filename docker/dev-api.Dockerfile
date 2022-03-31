FROM node:lts-alpine3.14
RUN npm install --global nodemon
WORKDIR /app
ENV NODE_ENV=development
COPY ./src/backend/package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]