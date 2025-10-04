# Dockerfile

# =========================================================
# 1. BUILD STAGE (Generates the Next.js and Prisma Client code)
# =========================================================
FROM node:20-alpine AS builder

RUN apk update && apk upgrade

# Set environment variable for build process
ENV NODE_ENV production

# Set the working directory
WORKDIR /app

# Copy package.json and lock files first to leverage Docker cache
# 🚀 This line is still crucial for cache control and dependency visibility
COPY package.json package-lock.json* ./

# Install ALL dependencies (dev and prod) to ensure build tools are available
RUN npm install

# Copy the Prisma schema and run generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# 🚀 NEW STEP: Re-install dependencies needed for the build (safeguard)
# This step often fixes path resolution issues specific to Next.js builds in Alpine containers.
# We ensure the build environment is completely ready before calling next build.
RUN npm install --only=dev

# Run the Next.js production build command
RUN npm run build


# =========================================================
# 2. RUNNER STAGE (Minimal image for serving the application)
# =========================================================
FROM node:20-alpine AS runner

RUN apk update && apk upgrade

# Set environment variables for runtime
ENV NODE_ENV production
ENV PORT 3000

# Set the working directory
WORKDIR /app

# Install only production dependencies for runtime
COPY package.json ./package.json
RUN npm install --omit=dev

# Copy essential runtime files from the builder stage:
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# The command to run the application
CMD ["npm", "start"]