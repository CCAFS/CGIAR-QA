FROM node:10-alpine

WORKDIR /usr/src/app

COPY CGIAR-QA-back/package*.json ./

RUN npm i --production --silent

COPY CGIAR-QA-back/ .

COPY CGIAR-QA-front/dist /usr/src/CGIAR-QA-front/dist

EXPOSE 3000

CMD [ "node", "build/index.js" ]
