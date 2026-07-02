FROM node:22-alpine AS deps
ENV COREPACK_INTEGRITY_KEYS=0
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --dangerously-allow-all-builds

FROM node:22-alpine AS builder
ENV COREPACK_INTEGRITY_KEYS=0
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV COREPACK_INTEGRITY_KEYS=0
WORKDIR /app
RUN corepack enable
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
EXPOSE 3000
USER nextjs
CMD ["pnpm", "start"]