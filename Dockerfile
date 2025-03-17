FROM oven/bun:1.2.5-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production --ignore-scripts

FROM base AS builder
COPY --from=deps /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS runner
COPY --from=deps --chown=bun:run  /temp/prod/node_modules node_modules
COPY --from=builder --chown=bun:run  /usr/src/app/dist dist
COPY --chown=bun:run package.json .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
