FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

EXPOSE 3000

# Run Next.js development server
CMD ["npm", "run", "dev"]
