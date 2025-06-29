# Use Node.js 18 on Alpine 3.17 as base image for libssl1.1 compatibility
FROM node:18-alpine3.17

# Install netcat and libssl1.1 for Prisma compatibility
RUN apk add --no-cache netcat-openbsd libssl1.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Copy and set permissions for wait-for-db script
COPY wait-for-db.sh ./
RUN chmod +x wait-for-db.sh

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Verify the build output exists
RUN ls -la dist/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application using the wait script
CMD ["./wait-for-db.sh"] 