FROM node:21

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["node", "main.js"] && \ 
    npx wait-port rabbit:5672 
    