# Use the official Node.js 16 image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (update if necessary)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
