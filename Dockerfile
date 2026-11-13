FROM node:24.22.1 AS builder

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
# The API base URL is compiled into the bundle (src/commons/http-commons.ts): the UI requests /biomolecules/..., /search...
# and this value is put in front of them. The API's routes all start with /api, so set it to end in /api, e.g.
#   docker build --build-arg REACT_APP_BASE_URL=/api .                      same origin, a proxy forwards /api/ unchanged
#   docker build --build-arg REACT_APP_BASE_URL=https://host.example/api .
ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
