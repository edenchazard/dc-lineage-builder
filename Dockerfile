FROM node:24.0-bookworm-slim AS base
WORKDIR /app

FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm i
COPY --link . .

RUN npm run update-breeds

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
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=build /prod/backend ./backend
COPY --from=build /prod/shared ./shared
COPY --from=build /app/dist ./backend/static

CMD ["npm", "run", "prod"]
