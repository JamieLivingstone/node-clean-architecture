# -----------------------
# Build Stage
# -----------------------
FROM node:24-slim AS builder

ENV NODE_ENV=production

WORKDIR /app

# Copy dependency files and prisma schema first for better caching
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including devDeps for build)
RUN npm ci --include=dev

# Copy the full source tree
COPY . .

# Build TypeScript
RUN npm run build

# -----------------------
# Production Stage
# -----------------------
FROM node:24-slim AS runner

WORKDIR /app

# Create and use a non-root user
RUN useradd -m -r -s /bin/bash nodejs

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm ci --omit=dev && \
    npx prisma generate --config prisma/prisma.config.ts && \
    npm cache clean --force

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start app
CMD ["node", "dist/server.js"]