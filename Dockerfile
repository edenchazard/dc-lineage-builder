ARG NODE_VERSION=lts-alpine

#####

FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
WORKDIR /app/app/backend
RUN npx tsc
WORKDIR /app/app/
RUN npm run vue:build

FROM node:${NODE_VERSION} AS production
WORKDIR /aaaaAAAAAAAAAA
ENV NODE_ENV=production
COPY package*.json ./
RUN npm i
COPY --from=build /prod/backend ./backend
COPY --from=build /prod/shared ./shared
COPY --from=build /app/dist ./
