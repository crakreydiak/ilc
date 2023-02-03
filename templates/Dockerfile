FROM node:16-alpine3.16 AS base

ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN

WORKDIR /app

RUN npm install -g pnpm

COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

FROM base AS registration

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

RUN pnpm exec registry-cli template publish
