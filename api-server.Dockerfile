FROM node:14.18.1-alpine3.14
EXPOSE 8080
WORKDIR /app
COPY ./src/backend/package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]