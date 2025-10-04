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
# Assuming you are using npm based on previous logs
COPY package.json package-lock.json* ./

# Install dependencies (development and production)
RUN npm install

# Copy the Prisma schema and run generate
# The 'prisma generate' command must run before 'next build'
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
# This is necessary because some packages (like Prisma Client) rely on them
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy essential runtime files from the builder stage:
# 1. The compiled Next.js build output
COPY --from=builder /app/.next ./.next
# 2. Public assets (e.g., /public/cinema.png)
COPY --from=builder /app/public ./public
# 3. Generated Prisma Client files and schema
# The client is located in node_modules/.prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# The schema file is needed at runtime for certain operations/migrations
COPY --from=builder /app/prisma ./prisma

# The command to run the application
CMD ["npm", "start"]