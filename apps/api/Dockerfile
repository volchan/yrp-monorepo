FROM node:21-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
COPY . .
RUN npx turbo prune api --docker

RUN npm i
RUN npx turbo run build --filter=api
RUN npm ci

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app .
RUN chown -R nodejs ./apps/api/dist

USER nodejs
EXPOSE 80
CMD node ./apps/api/dist/index.js
