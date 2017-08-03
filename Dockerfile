FROM debian:jessie

RUN apt-get update && apt-get install -y locales wget sudo net-tools ca-certificates && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

#Creating env for container
RUN echo "deb http://http.debian.net/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
# Add Google public key to apt
RUN wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | apt-key add -

# Add Google to the apt-get source list
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' | \
	tee /etc/apt/sources.list.d/google-chrome.list

# Add NodeJS to the apt-get source list
RUN wget -q -O - https://deb.nodesource.com/setup_7.x | bash -

RUN apt-get update
RUN apt-get install -y -t jessie-backports openjdk-8-jre
RUN apt-get install -y nodejs git g++ build-essential google-chrome-stable xvfb x11vnc

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

CMD ["npm", "run" ,"watch" ,"-s"]
# ">", "/usr/src/passwordkeeper/logs/watch.log"]
