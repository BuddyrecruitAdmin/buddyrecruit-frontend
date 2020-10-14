FROM node:12.18-alpine AS build
WORKDIR /app/src
COPY package.json package-lock.json ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine
EXPOSE 8080
WORKDIR /
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx /etc/nginx /var/run /run

CMD ["nginx", "-g", "daemon off;"]
