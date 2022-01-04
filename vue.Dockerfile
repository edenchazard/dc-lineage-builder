FROM node:current-slim
EXPOSE 8080
WORKDIR /app
COPY ./src/frontend/package.json /app/package.json
RUN npm install
RUN npm install -g @vue/cli
CMD ["npm", "run", "serve",  "--host", "0.0.0.0", "--port", "8080"]
