FROM node:16-alpine

WORKDIR /app

RUN apk update && apk --no-cache upgrade
RUN apk add curl
RUN apk add python3
RUN mkdir /app/uploads

COPY ./fonts /app/fonts
COPY ./middleware /app/middleware
COPY ./models /app/models
COPY ./routes /app/routes
COPY ./app.js /app
COPY ./package.json /app

RUN npm install -g rimraf node-gyp

RUN npm install

#USER node

CMD ["node","app.js"]