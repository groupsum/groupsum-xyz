FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY pkgs/frontend/package.json pkgs/frontend/package.json
COPY pkgs/site-content-pack/package.json pkgs/site-content-pack/package.json
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY pkgs/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/pkgs/frontend/dist /usr/share/nginx/html
EXPOSE 80
