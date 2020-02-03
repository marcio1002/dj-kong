FROM node:13.7.0

WORKDIR /usr/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
CMD ["npm","start"]
