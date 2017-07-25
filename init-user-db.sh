#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER vagrant WITH SUPERUSER PASSWORD 'vagrant';
    CREATE DATABASE pkeeper;
    GRANT ALL PRIVILEGES ON DATABASE pkeeper TO vagrant;
EOSQL