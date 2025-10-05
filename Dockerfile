FROM openjdk:21-jdk-alpine


# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all project files
COPY . .

# Expose port (match your Node.js server, usually 3000 or 8080)
EXPOSE 3000

# Start app
CMD ["npm", "start"]
