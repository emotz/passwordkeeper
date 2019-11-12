#!/bin/bash
case $NODE_ENV in
    production )
        npm run backend
        ;;
    development )
        npm run backend:watch
        ;;
    * )
        npm run backend:watch
        ;;
esac
