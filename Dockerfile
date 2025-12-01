FROM node:24.0-bookworm-slim AS base
WORKDIR /app

FROM base AS build
# Accept version and commit SHA as build arguments
ARG VERSION=0.0.0
ARG COMMIT_SHA=unknown

COPY --link package.json package-lock.json ./
RUN npm i
COPY --link . .

# Create VERSION file with build args
RUN echo "${VERSION}" > VERSION
RUN echo "${COMMIT_SHA}" > COMMIT_SHA

RUN npm run update-breeds

WORKDIR /app/app/backend
RUN npx tsc

WORKDIR /app
ARG VITE_BASE_URL="/dc/lineage-builder"
ENV VITE_BASE_URL=$VITE_BASE_URL
# Pass version and commit as environment variables for Vite to use
# (VERSION and COMMIT_SHA ARGs are still available from earlier in this stage)
ENV VITE_APP_VERSION=${VERSION}
ENV VITE_APP_COMMIT_SHA=${COMMIT_SHA}
RUN npm run vue:build

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=build /prod/backend ./backend
COPY --from=build /prod/shared ./shared
COPY --from=build /app/dist ./backend/static

CMD ["npm", "run", "prod"]
