# Build stage
FROM node:22-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]
