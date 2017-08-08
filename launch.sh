#!/bin/bash
if [[ $NODE_ENV = "development" ]]; then
	sh -c "npm run watch"
fi
if [[ $NODE_ENV = "production" ]]; then
	sh -c "npm run backend"
fi