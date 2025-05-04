FROM node:12.22-alpine AS builder

WORKDIR /app
COPY ./package.json ./
RUN npm install --loglevel verbose
COPY . .
RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf