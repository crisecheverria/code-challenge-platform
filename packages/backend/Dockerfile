FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create temp directory but exclude from build
RUN mkdir -p src/temp

# Build TypeScript
RUN npm run build

# Copy the runner Dockerfile
COPY Dockerfile.runner ./Dockerfile.runner

EXPOSE 3001

CMD ["node", "dist/index.js"]
