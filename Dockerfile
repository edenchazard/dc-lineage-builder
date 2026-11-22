FROM node:26.13.1-trixie-slim AS base
WORKDIR /app

FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm ci
COPY --link . .

ARG NUXT_APP_BASE_URL="/dc/lineage-builder"
ARG VERSION=0.0.0
ARG COMMIT_SHA=unknown
ENV NUXT_APP_BASE_URL=$NUXT_APP_BASE_URL
ENV NUXT_PUBLIC_APP_VERSION=$VERSION
ENV NUXT_PUBLIC_APP_COMMIT_SHA=$COMMIT_SHA
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ENV NUXT_APP_BASE_URL="/dc/lineage-builder"
COPY --chown=node:node --from=build /app/.output ./.output
RUN rm -rf /usr/local/lib/node_modules/npm/ /usr/local/bin/npm && \
  chown -R node:node .output

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
