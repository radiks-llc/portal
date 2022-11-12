FROM node:18 AS build

WORKDIR /build

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY tailwind.config.cjs ./
COPY astro.config.mjs ./
COPY .npmrc ./
COPY src ./src
COPY scripts ./scripts
COPY public ./public

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /build/dist /app

COPY package*.json ./

RUN npm ci --omit=dev

CMD ["node", "./server/entry.mjs"]
