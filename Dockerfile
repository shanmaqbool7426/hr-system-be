# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Bundle app source inside Docker image
COPY . .

RUN mv .env.dev .env
# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8000

# Define the command to run your app (this assumes your main file is named app.js, adjust as necessary)
CMD ["npm", "run", "start"]
