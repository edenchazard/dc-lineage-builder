FROM node:lts-alpine3.14 as build
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node ./package*.json ./src ./
RUN npm install

ENTRYPOINT ["npm", "run", "prod"]