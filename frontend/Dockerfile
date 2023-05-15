FROM node:alpine as stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx
COPY --from=stage /app/build /usr/share/nginx/html