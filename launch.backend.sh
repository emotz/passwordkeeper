#!/bin/bash
case $NODE_ENV in
    development )
        npm run backend:watch
        ;;
    production )
        npm run backend
        ;;
    * )
        exit 1
        ;;
esac
