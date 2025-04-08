# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all backend files
COPY . .

# Compile TypeScript
RUN npm run build:backend

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app
# CMD ["node", "dist/server.js"]
CMD ["npm", "start"]
