FROM node:14.18.1-alpine3.14
WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install --quiet
COPY ./backend .