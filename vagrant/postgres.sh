# Add PostgreSQL to the apt-get source list
echo "deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
    apt-key add -

apt-get install -y postgresql postgresql-client

echo "Starting PostgreSQL server"
service postgresql restart
# TODO fix hardcoded sleeps
sleep 3

echo "Creating role for vagrant user for PostgreSQL"
su postgres -c "createuser -d -l -r -s -w -i vagrant"
sleep 3

echo "Creating database pkeeper"
su postgres -c "createdb -E UTF8 -T template0 --locale=en_US.utf8 -O vagrant pkeeper"
sleep 3

su postgres -c "psql pkeeper -c \"ALTER USER vagrant PASSWORD 'vagrant';\""
