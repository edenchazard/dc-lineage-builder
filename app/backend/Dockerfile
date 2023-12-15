FROM node:lts-alpine as base
WORKDIR /app
EXPOSE 3000

FROM base as prod
WORKDIR /app
COPY . .
RUN npm run vue:build
CMD npm run serv

FROM base as dev
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
CMD npm run server:start
