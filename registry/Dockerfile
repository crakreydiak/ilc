FROM node:14-alpine

ARG DB_HOST_ARG
ENV DB_HOST=$DB_HOST_ARG

ARG DB_USER_ARG
ENV DB_USER=$DB_USER_ARG

ARG DB_PASSWORD_ARG
ENV DB_PASSWORD=$DB_PASSWORD_ARG

# ARG NODE_ENV_ARG
# ENV NODE_ENV=$NODE_ENV_ARG

ARG DB_CLIENT_ARG
ENV DB_CLIENT=$DB_CLIENT_ARG

ARG DB_NAME_ARG
ENV DB_NAME=$DB_NAME_ARG

ENV NODE_ENV production

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN echo $DB_CLIENT

# Legacy infrastructure support
RUN npm install -g stdout-mq@^2.4.0

ADD ./ /codebase
WORKDIR /codebase

RUN npm install --production=false --no-package-lock --no-progress --ignore-scripts
RUN npm rebuild bcrypt --build-from-source
RUN npm install sqlite3 mysql

RUN cd ./client && npm install --production=false --no-progress --ignore-scripts

RUN npm run build

CMD ["npm", "run", "start:docker"]
