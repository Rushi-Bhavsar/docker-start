# BASE IMAGE
FROM node:14-alpine

# Copy local files into temp container that is created while build the image.
COPY ./ ./

# Install some dependencies
RUN npm install

# Startup Command
CMD ["npm", "start"]

