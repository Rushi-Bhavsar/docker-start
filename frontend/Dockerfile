FROM node:alpine as stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=stage /app/build /usr/share/nginx/html
