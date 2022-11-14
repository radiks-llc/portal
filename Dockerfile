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

# RUN --mount=type=secret,id=ASTROAUTH_URL \
#     ASTROAUTH_URL="$(cat /run/secrets/ASTROAUTH_URL)" \
#     --mount=type=secret,id=ASTROAUTH_SECRET \
#     ASTROAUTH_SECRET="$(cat /run/secrets/ASTROAUTH_SECRET)" \
#     --mount=type=secret,id=MITCH_PASS \
#     MITCH_PASS="$(cat /run/secrets/MITCH_PASS)" \
#     --mount=type=secret,id=DATABASE_URL \
#     DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \

COPY .env.production ./

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /build/dist /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

CMD ["node", "./server/entry.mjs"]
