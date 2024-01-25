FROM node:16-alpine

WORKDIR /app

ARG DEP=""

RUN apk update && \
    apk upgrade && \
    apk add --no-cache python3 ${DEP} && \
    rm -rf /var/cache/apk/*


COPY ./fonts /app/fonts
COPY ./middleware /app/middleware
COPY ./models /app/models
COPY ./routes /app/routes
COPY ./app.js /app
COPY ./package.json /app

RUN npm install -g rimraf node-gyp

RUN npm install

USER node

ENV MONGOURI="mongodb://localhost:2717/RJD" DefaultPass="x+Ku1?n.ypg8BCGjWb>f" JWTSECRET="yzwDw_fi+Y@wc7,^=eb1?.rkVUU>.n"

CMD ["node","app.js"]