VERSION 0.8
FROM node:lts
WORKDIR /workspace

deps:
  COPY package.json package-lock.json .
  RUN npm ci

lint:
  FROM +deps
  COPY --dir src eslint.config.js tsconfig.json .
  RUN npm run lint

build:
  FROM +deps
  COPY --dir src tsconfig.json .
  RUN npm run build
  SAVE ARTIFACT dist

test:
  ARG --required example
  FROM +build
  COPY examples/$example examples/$example
  WORKDIR examples/$example
  RUN npm ci
  RUN npm run build

test.all:
  COPY examples examples
  FOR file IN $(ls examples)
    BUILD +test --example $file
  END

ci:
  BUILD +lint
  BUILD +build
  BUILD +test.all
