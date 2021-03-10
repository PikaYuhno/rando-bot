FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
COPY .env ./dist
COPY src/rsc ./dist/rsc
WORKDIR ./dist

CMD node index.js
