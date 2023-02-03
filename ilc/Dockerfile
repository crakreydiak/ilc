FROM node:14-alpine

ARG NODE_ENV_ARG

ARG REGISTRY_ADDR_ARG
ENV REGISTRY_ADDR=$REGISTRY_ADDR_ARG

ARG OVERRIDE_CONFIG_TRUSTED_ORIGINS_ARG
ENV OVERRIDE_CONFIG_TRUSTED_ORIGINS=$OVERRIDE_CONFIG_TRUSTED_ORIGINS_ARG

ARG LOCAL_X_REQUEST_HOST_ARG
ENV LOCAL_X_REQUEST_HOST=$LOCAL_X_REQUEST_HOST_ARG

RUN apk --no-cache add --virtual builds-deps build-base python3 curl
RUN apk add --update --no-cache bash git openssh make g++ findutils

RUN npm install -g pnpm

ENV PNPM_HOME /usr/local/bin
ENV PATH $PNPM_HOME:$PATH

# Legacy infrastructure support
RUN pnpm install -g stdout-mq@^2.4.0

WORKDIR /codebase

COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm install

COPY . .

ENV NODE_ENV=$NODE_ENV_ARG

RUN pnpm run build
RUN echo "Done building..."

CMD ["npm", "start"]
