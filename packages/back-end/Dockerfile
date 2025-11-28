# Base Stage
FROM node:22-alpine AS base
RUN npm install -g pnpm
WORKDIR /usr/src/app

# Dependencies Stage And Build Stage
FROM base AS dependencies_and_build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/back-end/package.json ./packages/back-end/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/back-end/package.json ./packages/back-end/
RUN pnpm fetch && pnpm install --frozen-lockfile

COPY packages/back-end/ ./packages/back-end/
COPY packages/shared-types/ ./packages/shared-types/
RUN pnpm build --filter @basic-project/shared-types --filter back-end

# Production Stage
FROM base AS production
ENV NODE_ENV=production

COPY --from=dependencies_and_build /usr/src/app/packages/back-end/package.json ./packages/back-end/
COPY --from=dependencies_and_build /usr/src/app/packages/shared-types/package.json ./packages/shared-types/

COPY --from=dependencies_and_build /usr/src/app/node_modules ./node_modules
COPY --from=dependencies_and_build /usr/src/app/packages/back-end/node_modules ./packages/back-end/node_modules
COPY --from=dependencies_and_build /usr/src/app/packages/back-end/dist ./packages/back-end/dist
COPY --from=dependencies_and_build /usr/src/app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY --from=dependencies_and_build /usr/src/app/packages/shared-types/dist ./packages/shared-types/dist

EXPOSE 3001
CMD ["node", "packages/back-end/dist/main"]
