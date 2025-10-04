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
COPY . .

# --- Minimal Environment Variables ---
# Only define the two variables requested by the user.
# NEXT_PUBLIC variables are for client-side code, DATABASE_URL is for server/Prisma.
ARG NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ARG DATABASE_URL="file:./dev.db" 

# Set environment variables in build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV="production"
ENV PORT=3000

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Prisma and Build Steps
# NOTE: Using file:./dev.db means the database is local to the container and reset on each deploy.
# This is usually fine for testing but not for production unless you're using persistent storage.
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
RUN pnpm run seed
RUN pnpm next telemetry disable

# Build the Next.js application
RUN pnpm run build

# Expose the port
EXPOSE 3000

# =========================================================
# 2. RUNNER STAGE (Minimal environment for runtime)
# =========================================================
FROM node:slim AS runner

# Set environment variables for Next.js runtime
ENV NODE_ENV production
ENV PORT 3000

# Set the working directory
WORKDIR /app

# CRITICAL FIX: Install pnpm globally in the runner stage
RUN npm install -g pnpm

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies for runtime
RUN pnpm install --prod --frozen-lockfile

# Copy essential runtime files from the builder stage:
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# The command to run the application using the standalone server script
CMD ["node", "server.js"]