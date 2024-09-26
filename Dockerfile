# Use the official Node.js image from Docker Hub
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json /app/


RUN npm install

# Copy the rest of the application code to the container
COPY . /app

# Install nodemon globally if needed
RUN npm install -g nodemon

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["nodemon", "app.js"]
