[![Build Status](https://travis-ci.org/emotz/passwordkeeper.svg?branch=v1.0)](https://travis-ci.org/emotz/passwordkeeper)

# PasswordKeeper

Simple storage for passwords. Uses VueJS for front-end.

## Tech description

`Dockerfile` is a configuration file for `Docker`. It is used to build docker
image and provide conservative environment amongst developers machines.

`docker-compose.yml` is a configuration file for `docker-compose`. It is used to connect
containers between themselvse and attach them to each other.

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

Development server is `local-web-server`. It is simple http server, designed to
be easily mockable and configurable for easy startup. Its config file along with
registered routes is `frontend/server-mocks/.local-web-server.json`.
Route-handlers are located at `frontend/server-mocks/src`.

`WebDriverIO` is used to run end-to-end tests (full-stack tests). It uses
Selenium as engine.

## Docker setup (for Windows host)

If you already have *Docker* installed, you can
skip this section and move to `Build & Run`.

If your operation system is `Windows 10 Pro` and your processor supports `Hyper-V` technology,
you can install `Docker for Windows` from [here](https://docs.docker.com/docker-for-windows/install/).
Reccomends to install `stable` version.

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

## Build & Run

Firstly finish `Docker setup` section.

Then `cd` into project root directory.

And then

```bat
docker-compose build
```

This will take ~25-30 min to finish.

All future start-ups should be like following (and much faster than first one):

```bat
docker-compose up passwordkeeper
```

(wait about 30 secs after `docker-compose up passwordkeeper` is finished for build to complete)

`docker-compose up passwordkeeper` command makes Docker to start containers, attaching them to themselfes, set up all builds,
watches and dev servers. You are ready to go! Open `http://localhost:1337` in
your browser.

## Debug

### VSCode

Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension.

Open project in *VSCode*, press `ctrl-shift-d`, select `Both` for launch
configuration and press `f5`.

## Linting

You probably want to `npm install` from your host machine as well to have your
editor access to the tools like `eslint`. After that (or if you installed
`eslint` globally) you can do `npm run lint -s` to lint the entire project.

## Advanced: Build & Run

For more precise control, after `docker-compose up passwordkeeper` you can ssh into virtual machine by
using

```bat
docker exec -it passwordkeeper_passwordkeeper_1 bash
```

While you are in ssh, you can do other commands, listed below (or simply do `npm
run` to get list of available scripts to run).

### Build

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
NODE_ENV=development
npm run build
```

### Start dev server

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
npm run dev
```

### Run unit tests

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
npm run test-unit
```

*Notice*: It doesn't build the project, it builds only tests.

To watch on the unit-test:

```bat
npm run test-unit:watch
```

### Run e2e tests

*Warn*: Don't forget to `docker-compose run test-runner`

*Notice*: First start will take quite a bit of time because it downloads selenium and chrome driver.

```bat
npm run test-e2e
```

*Notice*: It doesn't build the project

### Run all tests

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
npm run test
```

*Notice*: It doesn't build the project

### Production build

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
NODE_ENV=production
npm run build
```

### Clean

*Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash`

```bat
npm run clean
```

