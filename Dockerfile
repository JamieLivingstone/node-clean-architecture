# -----------------------
# Build Stage
# -----------------------
FROM node:24-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

# Copy dependency files and prisma schema first for better caching
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including devDeps for build)
# Skip scripts to avoid lefthook/git requirement
RUN npm ci --include=dev --ignore-scripts

# Copy the full source tree
COPY . .

# Generate Prisma client (needs dotenv from devDeps)
RUN npx prisma generate --config prisma/prisma.config.ts

# Build TypeScript
RUN npm run build

# -----------------------
# Production Stage
# -----------------------
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Set ownership to node user (built-in to Alpine image)
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Set environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start app
CMD ["node", "dist/server.js"]