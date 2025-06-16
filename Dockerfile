FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
RUN yarn build:dev

FROM nginx:mainline-alpine AS production
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
