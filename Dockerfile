# Use the latest LTS version of Node.js
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the compiled JavaScript files
COPY dist ./dist

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start"]
