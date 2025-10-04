# Dockerfile

# =========================================================
# 1. BUILD STAGE (Node Slim with pnpm, full build environment)
# =========================================================
FROM node:slim AS builder

# Install pnpm globally and install necessary OS packages
RUN apt-get update -y \
    && apt-get install -y openssl curl \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Copy all source code and config files ---
# This includes package.json, prisma, next.config.js, etc.
COPY . .

# --- Build Arguments/Environment Variables ---
# NOTE: ARG values are for build-time use only. ENV sets runtime variables.
# We set all required ENV variables based on ARGs or hardcoding production defaults.
# These ARGs should be passed during the 'docker build' command if needed.
ARG HOSTNAME
ARG NODE_ENV="production"
# Assuming these are passed via CapRover/docker-compose for runtime
ARG DATABASE_URL
ARG JWT_SECRET
ARG MINIO_ENDPOINT
ARG MINIO_USE_SSL
# ... include all other ARGs listed in your old file ...

ENV HOSTNAME=$HOSTNAME
ENV NODE_ENV=$NODE_ENV
ENV DATABASE_URL=$DATABASE_URL
# ... include all other ENV variables from your old file ...
ENV PORT=3000

# Install dependencies using pnpm
# Using a cache bust (as the COPY . . above is the cache buster)
RUN pnpm install --frozen-lockfile

# --- CRITICAL FIXES FOR PRISMA AND TAILWIND ---
# 1. Generate Prisma Client (MUST run BEFORE build and migration)
RUN pnpm prisma generate

# 2. Run migrations (CapRover will need database access here)
RUN pnpm prisma migrate deploy

# 3. Run seed script
RUN pnpm run seed

# 4. Disable Next.js telemetry
RUN pnpm next telemetry disable

# Build the Next.js application
# This is where the Tailwind/PostCSS modules are required and compiled
RUN pnpm run build


# =========================================================
# 2. RUNNER STAGE (Minimal environment for runtime)
# =========================================================
FROM node:slim AS runner

# Set environment variables for Next.js runtime
ENV NODE_ENV production
ENV PORT 3000

# Set the working directory
WORKDIR /app

# Install only production dependencies for runtime security and size
# Using the lockfile from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

# Copy essential runtime files from the builder stage:
# 1. The compiled Next.js build output (standalone mode server + .next)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# 2. Prisma schema (needed by the client at runtime for some operations)
COPY --from=builder /app/prisma ./prisma

# The command to run the application using the standalone server script
# Note: Your package.json uses "start_prod": "node .next/standalone/server.js"
# We must use the script location relative to the final WORKDIR
CMD ["node", "server.js"]