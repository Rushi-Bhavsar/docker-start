FROM node:alpine as stage

WORKDIR /app

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=stage /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]