# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy environment files if needed
COPY --chown=nodejs:nodejs .env* ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
