# BUILD STAGE
FROM node:current-alpine3.19 AS build

WORKDIR /app

COPY --chown=node:node package*.json .

RUN npm ci

COPY --chown=node:node . .

ARG API_BASE_URL
ARG WS_BASE_URL

ENV REACT_APP_API_BASE_URL=${API_BASE_URL}
ENV REACT_APP_WS_BASE_URL=${WS_BASE_URL}

RUN npm run build

ENV NODE_ENV production

# Clean up node modules
RUN npm ci --only=production && npm cache clean --force

USER node

# PRODUCTION STAGE
FROM nginx AS prod

COPY --from=build --chown=node:node /app/nginx.conf /etc/nginx/nginx.conf 
COPY --from=build --chown=node:node /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]