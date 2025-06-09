# Use Node.js Alpine as base image (lightweight)
FROM node:alpine AS base

# Dependencies stage
FROM base AS deps
# Install libc6-compat for compatibility with certain native modules
RUN apk add --no-cache libc6-compat
# Enable pnpm
RUN corepack enable pnpm
# Set working directory
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml ./
# Install dependencies (disable strict peer deps to resolve conflicts)
RUN pnpm install --frozen-lockfile --strict-peer-dependencies=false

# Builder stage
FROM base AS builder
# Enable pnpm
RUN corepack enable pnpm
WORKDIR /app
# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application
COPY . .
# Build the application (no sensitive envs used here)
RUN pnpm run build

# Runner stage (production)
FROM base AS runner
WORKDIR /app

# Set non-sensitive environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Add system group and user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory from builder stage
COPY --from=builder /app/public ./public

# Create .next directory for Next.js build output
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone folder and static files with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]