FROM node:lts-alpine3.14 as build
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node ./src/backend/package*.json ./
RUN npm install
COPY --chown=node:node ./src/backend ./
USER node
ENTRYPOINT [ "node", "server.js" ]