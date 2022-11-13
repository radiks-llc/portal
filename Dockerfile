FROM node:18 AS build

WORKDIR /build

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY tsconfig.json ./
COPY tailwind.config.cjs ./
COPY astro.config.mjs ./
COPY .npmrc ./
COPY src ./src
COPY scripts ./scripts
COPY public ./public

RUN yarn --cwd scripts && \
    yarn --cwd scripts fetch-posts-notion

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /build/dist /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

CMD ["node", "./server/entry.mjs"]
