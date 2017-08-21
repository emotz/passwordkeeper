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

If you already have *Docker* installed, you can
skip this section and move to `Build & Run`.

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

## Build & Run

Firstly finish `Docker setup` section.

Then `cd` into project root directory.

And then

```bat
docker-compose pull base base-e2e base-frontend
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

Open project in *VSCode*, press `ctrl-shift-d`, select `Both` for launch
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

### Build base images

```bat
docker-compose build base && docker-compose build base-e2e base-frontend
docker-compose push base base-e2e base-frontend
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

<!-- ### Production build -->

<!-- *Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash` -->

<!-- ```bat -->
<!-- NODE_ENV=production -->
<!-- npm run build -->
<!-- ``` -->

<!-- ### Clean -->

<!-- *Warn*: Don't forget to `docker exec -it passwordkeeper_passwordkeeper_1 bash` -->

<!-- ```bat -->
<!-- npm run clean -->
<!-- ``` -->

