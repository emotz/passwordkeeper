FROM node:latest

#Creating env for container
RUN echo "deb http://http.debian.net/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
# Add Google public key to apt
RUN wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | apt-key add -

# Add Google to the apt-get source list
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' | \
	tee /etc/apt/sources.list.d/google-chrome.list

# Add NodeJS to the apt-get source list
RUN wget -q -O - https://deb.nodesource.com/setup_7.x | bash -

# Add PostgreSQL to the apt-get source list
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list 
RUN	wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
	apt-key add -

RUN apt-get update
RUN apt-get install -y -t jessie-backports openjdk-8-jre
RUN apt-get install -y nodejs git g++ build-essential google-chrome-stable xvfb x11vnc
#RUN apt-get install -y postgresql postgresql-client
	
#RUN echo "Starting PostgreSQL server"
#RUN service postgresql restart
#RUN sleep 3

RUN ["mkdir", "/docker-entrypoint-initdb.d"]
ADD init-user-db.sh /docker-entrypoint-initdb.d/

#RUN /etc/init.d/postgresql stop -- -m smart &&\
#sleep 30 &&\
#	/etc/init.d/postgresql start &&\
#	sleep 60 &&\
#   psql --command "CREATE USER vagrant WITH SUPERUSER PASSWORD 'vagrant';" &&\
#  createdb -O docker pkeeper

#RUN echo "listen_addresses='*'" >> /etc/postgresql/9.6/main/postgresql.conf
#RUN /etc/init.d/postgresql start
#RUN su postgres sh postgres -c "createuser -d -l -r -s -w -i vagrant"
#RUN psql -p 5432 -h localhost --command "CREATE USER vagrant WITH SUPERUSER PASSWORD 'vagrant';"
#RUN createdb -O vagrant pkeeper
#RUN su postgres -c "createuser -d -l -r -s -w -i vagrant"

# Create app directory
RUN mkdir -p /usr/src/passwordkeeper
WORKDIR /usr/src/passwordkeeper

# Install app dependencies
COPY package.json /usr/src/passwordkeeper/
RUN npm install

# Bundle app source
COPY . /usr/src/passwordkeeper

#RUN echo "Cleaning dist"
RUN npm run clean -s

#RUN mkdir /usr/src/passwordkeeper/logs
#CMD npm run nodemon -L --watch backend -x 'node --debug --harmony' backend/src/main.js
#RUN npm run-script parallelshell 'npm run dev -s' 'npm run build:watch -s' 'npm run backend -s'
CMD npm run watch -s > logs/watch.log 2>&1 &
#RUN npm run ./backend/src/main.js
#RUN npm run /usr/src/passwordkeeper/backend/src/main.js
#watch -s > /usr/src/passwordkeeper/logs/watch.log 2>&1 &