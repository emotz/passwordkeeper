FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/passwordkeeper
WORKDIR /usr/src/passwordkeeper

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/passwordkeeper

EXPOSE 8000 8000
EXPOSE 1337 1337
CMD [ "npm", "start" ]