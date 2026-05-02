FROM node:24.11-bookworm-slim AS base
WORKDIR /app

FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm i
COPY --link . .

WORKDIR /app/app/backend
RUN npx tsc

WORKDIR /app
ARG VITE_BASE_URL="/dc/lineage-builder"
ARG VERSION=0.0.0
ARG COMMIT_SHA=unknown
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_VERSION=$VERSION
ENV VITE_COMMIT_SHA=$COMMIT_SHA
RUN npm run vue:build

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node --from=build /prod/backend ./backend
COPY --chown=node:node --from=build /prod/shared ./shared
COPY --chown=node:node --from=build /app/dist ./backend/static
RUN rm -rf /usr/local/lib/node_modules/npm/ /usr/local/bin/npm ./node_modules/npm && \
  chown -R node:node node_modules

USER node

CMD ["node", "./backend/server.js"]
