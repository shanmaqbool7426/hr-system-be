#!/bin/bash

# Pull the latest changes from the remote repository
git pull

# Install dependencies
yarn

# Generate Swagger Documentation
yarn swagger-autogen

# Restart the PM2 process
pm2 restart all
