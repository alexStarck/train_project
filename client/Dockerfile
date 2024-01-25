FROM node:14-alpine

WORKDIR /app

ARG DEP=""

RUN apk update && \
    apk upgrade && \
    apk add --no-cache python3 ${DEP} && \
    rm -rf /var/cache/apk/*


COPY ./src /app/src
COPY ./public /app/public
COPY ./package.json /app

RUN npm install -g rimraf node-gyp

RUN npm install

USER node

EXPOSE 5000

CMD ["npm","start"]