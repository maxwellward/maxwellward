# Step 1: Build Vue.js app
FROM node:16 AS build

WORKDIR /app

# Install dependencies and build the production version of the app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Use serve to serve the built app
FROM node:16-alpine

# Install serve globally
RUN npm install -g serve

# Set the working directory to the directory where the built files are located
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist /app

# Expose the port that serve will run on
EXPOSE 5001

# Start serve to serve the built Vue app
CMD ["serve", "-s", ".", "-l", "5001"]