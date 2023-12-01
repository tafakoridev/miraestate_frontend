# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install
# Install project dependencies
RUN npm i -g next

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the desired port (usually 3000 for Next.js)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
