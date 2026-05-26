FROM node:25-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5005

CMD ["npm", "start"]    