FROM node:24.22.1 AS builder

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
# The API base URL is compiled into the bundle (src/commons/http-commons.ts): the UI requests /biomolecules/..., /search...
# and REACT_APP_BASE_URL is put in front of them. The API's routes all start with /api, so it must end in /api.
# Set it in a .env file next to this Dockerfile (REACT_APP_BASE_URL=/api, not committed) or per build:
#   docker build --build-arg REACT_APP_BASE_URL=https://host.example/api .
# No ENV line on purpose: an ENV with an empty value would beat the .env file.
ARG REACT_APP_BASE_URL
RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
