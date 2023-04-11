# BASE IMAGE
FROM node:14-alpine

WORKDIR /usr/app

# Copy only package.json. So that npm install will not trigger until we update the package.json file.
COPY ./package.json ./

# Install some dependencies
RUN npm install

# Now we can copy the source code and all other files. Even if we are not copying the package.json npm install will not trigger.
# Only step below the COPY command will execute.
COPY ./ ./

# Startup Command
CMD ["npm", "start"]

