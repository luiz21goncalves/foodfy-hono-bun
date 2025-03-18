FROM oven/bun:1.2.5-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
WORKDIR /temp/dev
COPY package.json bun.lock /temp/dev/
RUN bun install --frozen-lockfile --ignore-scripts

FROM base AS builder
COPY --from=deps /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS runner
COPY --from=builder --chown=bun:run  /usr/src/app/dist dist
COPY --chown=bun:run package.json .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
