FROM node:24.0-bookworm-slim AS base
WORKDIR /app
# Create default VERSION file if not provided during build
# To set a version during build, create a VERSION file in the build context
RUN echo "0.0.0" > VERSION

FROM base AS build
COPY --link package.json package-lock.json ./
RUN npm i
# Copy VERSION file from build context if it exists, otherwise use the default
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
