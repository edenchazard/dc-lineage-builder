ARG NODE_VERSION=lts-slim

#####

FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
WORKDIR /app/app/backend
RUN npx tsc
WORKDIR /app/app/
RUN npm run vue:build
WORKDIR /app

FROM node:${NODE_VERSION} AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY --from=build /prod/backend ./backend
COPY --from=build /prod/shared ./shared
COPY --from=build /app/dist ./backend/static
