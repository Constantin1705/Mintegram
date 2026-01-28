FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

EXPOSE 3001

# Run Next.js development server on port 3001
CMD ["npm", "run", "dev", "--", "-p", "3001"]
