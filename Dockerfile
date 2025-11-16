FROM node:24.0-bookworm-slim AS base
WORKDIR /app
RUN echo "0.0.0" > VERSION

FROM base AS build
COPY --link package.json package-lock.json ./
RUN npm i
COPY --link . .

RUN npm run update-breeds

WORKDIR /app/app/backend
RUN npx tsc

WORKDIR /app
ARG VITE_BASE_URL="/dc/lineage-builder"
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run vue:build

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=build /prod/backend ./backend
COPY --from=build /prod/shared ./shared
COPY --from=build /app/dist ./backend/static

CMD ["npm", "run", "prod"]
