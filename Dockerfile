FROM node:alpine as builder

ENV NODE_ENV build

USER node

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build \
  && npm prune --production


# ---

FROM node:alpine

ENV NODE_ENV production

USER node

WORKDIR /src

COPY --from=builder --chown=node:node /src/package*.json ./
COPY --from=builder --chown=node:node /src/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /src/dist/ ./dist/
COPY --from=builder --chown=node:node /src/public/ ./public/

CMD ["node", "dist/main.js"]