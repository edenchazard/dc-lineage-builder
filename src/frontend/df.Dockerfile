FROM node:lts-alpine
WORKDIR /app
ENV NODE_ENV=development
ENV VITE_APP_URL=/
COPY ./package*.json ./
RUN npm install --force

ENTRYPOINT ["npm", "run", "serve"]