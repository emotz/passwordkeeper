FROM tolkatch/jessieps:latest

# Create app directory
RUN mkdir -p /usr/src/passwordkeeper
WORKDIR /usr/src/passwordkeeper

# Install app dependencies
COPY package.json /usr/src/passwordkeeper/
RUN npm install

# Bundle app source
COPY . /usr/src/passwordkeeper

# Cleaning dist
RUN npm run clean -s

ARG nodeenv
ARG nodeenv=development
ENV NODE_ENV $nodeenv

RUN npm run build

CMD ["./launch.sh"]