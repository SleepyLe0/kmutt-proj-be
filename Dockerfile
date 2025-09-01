# Common build stage
FROM node:20-alpine AS common-build-stage

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Development build stage
FROM common-build-stage AS development-build-stage

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage AS production-build-stage

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
