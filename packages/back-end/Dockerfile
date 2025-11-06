# Base Stage
FROM node:22-alpine As base
RUN npm install -g pnpm
WORKDIR /usr/src/app

# Dependencies Stage And Build Stage
FROM base As dependenciesAndBuild
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/back-end/package.json ./packages/back-end/
RUN pnpm fetch && pnpm install --frozen-lockfile

COPY packages/back-end/ ./packages/back-end/
COPY packages/shared-types/ ./packages/shared-types/
RUN pnpm --filter back-end build

# Production Stage
FROM base as production
ENV NODE_ENV=production
COPY --from=dependenciesAndBuild /usr/src/app/node_modules ./node_modules
COPY --from=dependenciesAndBuild /usr/src/app/packages/back-end/node_modules ./packages/back-end/node_modules
COPY --from=dependenciesAndBuild /usr/src/app/packages/back-end/dist ./packages/back-end/dist

EXPOSE 3000
CMD ["node", "packages/back-end/dist/main"]
