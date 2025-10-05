# server/Dockerfile
# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache tini curl

# Create non-root user
RUN addgroup -g 1000 ivanchat && \
    adduser -D -u 1000 -G ivanchat ivanchat

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=ivanchat:ivanchat /app/dist ./dist
COPY --from=builder --chown=ivanchat:ivanchat /app/node_modules ./node_modules
COPY --from=builder --chown=ivanchat:ivanchat /app/package*.json ./

# Copy additional files
COPY --chown=ivanchat:ivanchat migrations ./migrations
COPY --chown=ivanchat:ivanchat seeds ./seeds

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs /app/temp && \
    chown -R ivanchat:ivanchat /app

# Switch to non-root user
USER ivanchat

# Expose ports
EXPOSE 5000 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Use tini as entrypoint to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/index.js"]