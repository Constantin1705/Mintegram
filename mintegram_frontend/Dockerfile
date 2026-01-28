FROM node:20-alpine

WORKDIR /app

# Copy project files first to include quasar.config.ts before npm install
COPY . .

# Install dependencies (skip postinstall script initially)
RUN npm install --ignore-scripts

# Now run the postinstall script with proper context
RUN npm run postinstall

EXPOSE 9000

# Run development server
CMD ["npm", "run", "dev", "--", "--host"]
