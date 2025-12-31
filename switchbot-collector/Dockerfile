FROM oven/bun:1 AS base
WORKDIR /app

# 依存関係をインストール
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# 本番イメージ
FROM base AS release
COPY --from=install --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun src ./src
COPY --chown=bun:bun package.json ./

USER bun
CMD ["bun", "run", "src/main.ts"]
