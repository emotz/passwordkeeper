# PasswordKeeper

Simple storage for passwords. Uses VueJS for front-end.

## Tech description

`Vagrantfile` is a configuration file for `Vagrant`. It is used to provide
conservative environment amongst developers machines.

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

## Vagrant setup (for Windows host)

If you already have *VirtualBox*, *Vagrant* and *OpenSSH* installed, you can
skip this section and move to `Build & Run`.

*Optional*: Install [choco](https://chocolatey.org/) - package manager for
Windows to simplify installation process by executing following command:

```bat
:: elevated CMD (with Administrator rights):

@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
refreshenv
```

Install [Vagrant](https://www.vagrantup.com/),
[VirtualBox](https://www.virtualbox.org/), and *OpenSSH*:

*Notice*: If you have *PUTTY* ssh installed, you might need to move *OpenSSH*
before *PUTTY* in **PATH**

```bat
:: elevated CMD (with Administrator rights):

choco install vagrant
choco install virtualbox
choco install openssh
```

You might need to reboot after installing virtualbox.

Since virtual machines are taking a lot of disk space, you probably want to move
them out of system drive.

To do that with *VirtualBox*, open up `Oracle VM VirtualBox` manager and press
`Settings` button. There select `General` and adjust vm location.

To move *Vagrant* files to another drive, you need to change **VAGRANT_HOME**
env variable:

![Changing VAGRANT_HOME](/doc/vagrant_home.png?raw=true "Changing VAGRANT_HOME")

Set up *Vagrant*:

```bat
:: ordinal CMD (without Administrator rights):

vagrant plugin install vagrant-vbguest
```

## Build & Run

Firstly finish `Vagrant setup` section.

Then `cd` into project root directory.

Due to the [bug in VirtualBox Guest Additions](https://www.virtualbox.org/ticket/16670),
when starting up vagrant for first time you need to do:

```bat
:: this will finish with error `Vagrant was unable to mount VirtualBox shared folders...`

vagrant up
```

And then

```bat
vagrant provision
```

This will take ~25-30 min to finish.

All future start-ups should be like following, without `vagrant provision` (and much
faster than first one):

```bat
vagrant up
```

`vagrant up` command makes Vagrant to launch virtual machine, set up all builds,
watches and dev servers. You are ready to go! Open `http://localhost:8000` in
your browser.

To debug with *VSCode*:

Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension.

Open project in *VSCode*, press `ctrl-shift-d`, select `Both` for launch
configuration and press `f5`.

## Linting

You probably want to `npm install` from your host machine as well to have your
editor access to the tools like `eslint`. After that (or if you installed
`eslint` globally) you can do `npm run lint -s` to lint the entire project.

## Advanced: Build & Run

For more precise control, after `vagrant up` you can ssh into virtual machine by
using

```bat
vagrant ssh
```

While you are in ssh, you can do other commands, listed below (or simply do `npm
run` to get list of available scripts to run).

### Build

*Warn*: Don't forget to `vagrant ssh`

```bat
NODE_ENV=development
npm run build
```

### Start dev server

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run dev
```

### Run unit tests

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run test-unit
```

*Notice*: It doesn't build the project, it builds only tests.

To watch on the unit-test:

```bat
npm run test-unit:watch
```

### Run e2e tests

*Warn*: Don't forget to `vagrant ssh`

*Notice*: First start will take quite a bit of time because it downloads selenium and chrome driver.

```bat
npm run test-e2e
```

*Notice*: It doesn't build the project

### Run all tests

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run test
```

*Notice*: It doesn't build the project

### Production build

*Warn*: Don't forget to `vagrant ssh`

```bat
NODE_ENV=production
npm run build
```

### Clean

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run clean
```

