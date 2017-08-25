#!/bin/bash

docker-compose build --build-arg NODE_ENV=production frontend
docker-compose build --build-arg NODE_ENV=production backend
docker tag passwordkeeper/backend registry.heroku.com/passwordkeeper/web
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" registry.heroku.com
docker push registry.heroku.com/passwordkeeper/web
