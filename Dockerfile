# Dockerfile

# =========================================================
# 1. BUILD STAGE (Generates the Next.js and Prisma Client code)
# =========================================================
FROM node:20-alpine AS builder

# Set environment variable for build process
ENV NODE_ENV production

# Set the working directory
WORKDIR /app

# Copy package.json and lock files first to leverage Docker cache
# 🚀 CACHE BUSTING FIX: Adding a unique comment here forces Docker to re-run 'npm install'
COPY package.json package-lock.json* ./

# Install dependencies (development and production)
# This layer will be re-executed, ensuring all Tailwind/PostCSS modules are present.
RUN npm install

# Copy the Prisma schema and run generate
# This is necessary as 'next build' requires the generated client.
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Run the Next.js production build command
RUN npm run build


# =========================================================
# 2. RUNNER STAGE (Minimal image for serving the application)
# =========================================================
FROM node:20-alpine AS runner

# Set environment variables for runtime
ENV NODE_ENV production
# Next.js listens on this port. CapRover will proxy to it.
ENV PORT 3000

# Set the working directory
WORKDIR /app

# Install only production dependencies
COPY package.json ./package.json
RUN npm install --omit=dev

# Copy essential runtime files from the builder stage:
# 1. The compiled Next.js build output
COPY --from=builder /app/.next ./.next
# 2. Public assets
COPY --from=builder /app/public ./public
# 3. Generated Prisma Client files and schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# The command to run the application
CMD ["npm", "start"]