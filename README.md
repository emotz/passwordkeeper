[![Build Status](https://travis-ci.org/emotz/passwordkeeper.svg?branch=master)](https://travis-ci.org/emotz/passwordkeeper)

# PasswordKeeper

Simple storage for passwords. Uses VueJS for front-end.

## Tech description

`Dockerfile.*` are configuration files for `Docker`. They are used to build docker
image and provide conservative environment amongst developers machines.

`docker-compose.yml` is a configuration file for `docker-compose`. It is used to connect
containers between themselves and attach them to each other.

`jsconfig.json` is a Visual Studio Code file for project definition. There are
number of those files amongst the project to separate execution context.

Front-end source files are located at `frontend/src`.

Front-end unit-test specifications are located at `frontend/test`.

End-to-end tests specifications are located at `e2e`.

End-to-end test Page Objects are located at `e2e/pageobjects`. These objects are
helpers for the e2e-tests.

`Webpack` is used to precompile js scripts and bundle them into single giant js
at `frontend/dist/bundle.js`. This directory also contains a bunch of
precompiled fonts required for `bootstrap` and `index.html` which is an entry
point for our SPA app. Webpack config file is `frontend/webpack.config.js`.
"Vendor" libraries are separated into its own bundle
`frontend/dist/vendor.bundle.js` by using `frontend/vendor.webpack.config.js` as
a config. This is done so that building times for our app is smaller and so that
caching of infrequently changing lib files is possible for the future.

There is also `frontend/test.webpack.config.js`. This is for building unit
tests. They are first built into bundle `frontend/dist/test.bundle.js` and then
this bundle is monitored by `karma` to run unit tests.

`WebDriverIO` is used to run end-to-end tests (full-stack tests). It uses
Selenium as engine.

## Docker setup (for Windows host)

If you already have _Docker_ installed, you can
skip this section and move to `Build & Run`.

If you don't want to "pollute" your system with _Docker_, you can skip this section
and move to `Vagrant setup`.

If your operation system is `Windows 10 Pro` and your processor supports `Hyper-V` technology,
you can install `Docker for Windows` from [here](https://docs.docker.com/docker-for-windows/install/).
It is recommended to install `stable` version.

Else, you must install `Docker Toolbox` from [here](https://docs.docker.com/toolbox/toolbox_install_windows/).
After install for checking docker workability you can enter windows command line and then

```bat
docker info
```

You must have Hyper-V technology enabled or docker enables it in installing process.
If you want to enable `Hyper-V` technology before installing, how to do it you can read [here](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).

You might need to reboot after installing docker.

Docker has a virtual hard disk where it stores its containers.
It takes a lot of space. If you want to move it open up Docker `Settings`, then select
`Advanced` and adjust VHD location by setting `Images and volumes VHD location` parameter.

### Docker Toolbox (for Windows host)

In order to make volume mounting work within Docker Toolbox, few steps are required.

First, add shared folder from VirtualBox Manager - `<path_to_folder_with_repository> -> /var/pk`, enable autoconnect.

Second, add NAT port forwarding for port 1337 from VirtualBox Manager.

Then, for future commands instead of `docker-compose` write `docker-compose -f docker-compose.yml -f docker-compose.toolbox.yml`

E.g. instead of `docker-compose up frontend backend` do `docker-compose -f docker-compose.yml -f docker-compose.toolbox.yml up frontend backend`

## Vagrant setup

If you don't want to "pollute" your system with _Docker_, you can use _Vagrant_ instead to set up development
environment for you in the virtual machine.

```bat
vagrant up
```

Log in to the vagrant

```bat
vagrant ssh
cd /vagrant
```

Then see the `Build & Run` section.

### VSCode Remote SSH Over Vagrant

Set up vscode to have vagrant ssh host:

`F1 -> Remote-SSH: Open configuration File...`

Put there result of `vagrant ssh-config` with replaced hostname `default` to `passwordkeeper` (or the name to your likings):

```
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile <yourpath>/.vagrant/machines/default/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL
```

## Build & Run

Firstly finish `Docker setup` section.

Then `cd` into project root directory.

And then

```bat
docker-compose pull
docker-compose up backend frontend
```

This will take ~25-30 min to finish.

Future start-ups should be just

```bat
docker-compose up backend frontend
```

They will be much faster than first one.

`docker-compose up frontend` command makes Docker to start container for the
frontend, build it and set up watches on file changes to rebuild the UI and
starts livereload server.

`docker-compose up backend` command starts up the web
server and other required services.

You are ready to go! Open `http://localhost:1337` in your browser and enjoy!

## Debug

### VSCode

Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension.

Open project in _VSCode_, press `ctrl-shift-d`, select `Both` for launch
configuration and press `f5`.

## Linting

You probably want to `npm install` from your host machine as well to have your
editor access to the tools like `eslint`. After that (or if you installed
`eslint` globally) you can do `npm run lint -s` to lint the entire project.

## Advanced: Build & Run

For more precise control, after `docker-compose up backend frontend` you can ssh
into Docker by using

```bat
docker-compose exec backend bash
```

and

```bat
docker-compose exec frontend bash
```

While you are in ssh, you can do other commands - do `npm run` for available
commands.

### After pulling new changes

Just to make sure that your images are up-to-date

```bat
docker-compose pull
docker-compose stop && docker-compose rm -f && docker-compose build
```

### Run unit tests

```bat
docker-compose up karma-server karma-runner
```

### Run e2e tests

```bat
docker-compose run --rm test-runner & docker-compose stop test-postgres test-server & docker-compose rm -f test-postgres
```

```bash
docker-compose run --rm test-runner ; docker-compose stop test-postgres test-server ; docker-compose rm -f test-postgres
```

## Deploy

### Build runner image

```sh
docker-compose -f docker-compose.yml -f docker-compose.gitlab.yml build runner
docker login registry.gitlab.com # it will ask for your gitlab credentials
docker-compose -f docker-compose.yml -f docker-compose.gitlab.yml push runner
```

### First !

Only once:

```sh
docker-machine create --driver generic --generic-ip-address=emotz.info emotz
```

Always:

```sh
eval $(docker-machine env emotz)
```

### Deploy

Manual deploy is not supported. Deploy by pushing to github (which gets mirrored to gitlab and triggers deploy pipeline).

### Logs

```sh
docker-compose -f docker-compose.yml -f docker-compose.novolumes.yml -p passwordkeeper logs backend
```
