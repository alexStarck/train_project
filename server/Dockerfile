FROM node:16-alpine

WORKDIR /app

ARG DEP=""

RUN apk update && \
    apk upgrade && \
    apk add curl && \
    apk add python3
#    apk add --no-cache python3 ${DEP} && \
#    rm -rf /var/cache/apk/*


COPY ./fonts /app/fonts
COPY ./middleware /app/middleware
COPY ./models /app/models
COPY ./routes /app/routes
COPY ./app.js /app
COPY ./package.json /app

RUN npm install -g rimraf node-gyp

RUN npm install

USER node

CMD ["node","app.js"]