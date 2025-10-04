# === 1. BUILD STAGE ===
# Use a slim Node image for building
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock files first to leverage Docker cache
COPY package.json yarn.lock package-lock.json* ./

# Install dependencies (use npm ci for cleaner installs if using npm)
# Since your project uses React and Next.js, we assume you might have lucide-react, etc.
RUN npm install

# Copy the rest of the application code
COPY . .

# Next.js specific build command
# This creates the optimized production build in the .next folder
RUN npm run build

# --- Separate dependencies for static/public files ---
# Next.js recommends running the build command in a separate stage 
# if you want to optimize caching of static files. 
# However, for simplicity and common use, we copy them in the final stage.


# === 2. PRODUCTION DEPENDENCIES STAGE ===
# A small stage dedicated only to the node_modules required for runtime
FROM node:20-alpine AS runner

# Set environment variables for Next.js production
ENV NODE_ENV production
# Set the port Next.js will listen on (CapRover usually uses port 80 or 3000)
ENV PORT 3000

# Set the working directory
WORKDIR /app

# 1. Copy necessary files from the builder stage
# Copy the compiled production build (.next)
COPY --from=builder /app/.next ./.next

# Copy package.json to ensure 'npm start' works
COPY --from=builder /app/package.json ./package.json

# Copy public assets (like /public/cinema.png)
COPY --from=builder /app/public ./public

# Copy node_modules required for runtime (usually just production dependencies)
# We install only production dependencies to keep the image slim
RUN npm install --omit=dev

# We do not expose the port here; it's done by the runtime environment (CapRover/Hetzner)
# EXPOSE 3000

# The command to run the application
# Next.js starts the production server
CMD ["npm", "start"]