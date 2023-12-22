ARG NODE_VERSION=lts-alpine

#####

FROM node:${NODE_VERSION} AS build-server
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
WORKDIR /app/app/backend
RUN npx tsc

FROM node:${NODE_VERSION} AS build-vite
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:${NODE_VERSION} AS production
WORKDIR /aaaaAAAAAAAAAA
ENV NODE_ENV=production
COPY package*.json ./
RUN npm i
COPY --from=build-server /prod/backend ./backend
COPY --from=build-server /prod/shared ./shared
COPY --from=build-vite /app/dist ./
