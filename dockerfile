# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all backend files
COPY . .

# Expose the port your server runs on
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "dev"]
