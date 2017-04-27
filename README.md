# PasswordKeeper

Simple storage for passwords. Uses VueJS for front-end.

## Tech description

`Vagrantfile` is a configuration file for `Vagrant`. It is used to provide conservative environment amongst developers machines.

`fe/jsconfig.json` is a Visual Studio Code file for project definition.

`fe/tests/typings.json` configuration file for `typings` - it is used to provide intellisense.

Front-end source files are located at `fe/src`.

Front-end unit-test specifications are located at `fe/tests/specs`.

End-to-end tests specifications are located at `e2e-tests`.

End-to-end test Page Objects are located at `e2e-tests/po`. These objects are helpers for the e2e-tests.

`Webpack` is used to precompile js scripts and bundle them into single giant js at `fe/dist`. This directory also contains a bunch of precompiled fonts required for `bootstrap` and `index.html` which is an entry point for our SPA app. Webpack config file is `fe/webpack.config.js`.

Development server is `local-web-server`. It is simple http server, designed to be easily mockable and configurable for easy startup. Its config file along with registered routes is `fe/.local-web-server.json`. Route-handlers are located at `fe/mocks`.

`Karma` is used to run unit-tests for front-end. Its config file is `fe/tests/karma.conf.js`. It also uses `webpack` to precompile tests, but it doesnt use `fe/webpack.config.js` for that; instead, `fe/tests/webpack.config.js` is used.

`WebDriverIO` is used to run end-to-end tests (full-stack tests). It uses Selenium as engine.

## Vagrant setup (for Windows host)

If you already have *VirtualBox*, *Vagrant* and *OpenSSH* installed, you can skip this section and move to `Build & Run`.

*Optional*: Install [choco](https://chocolatey.org/) - package manager for Windows to simplify installation process:

```bat
:: elevated CMD (with Administrator rights):

@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
refreshenv
```

Install [Vagrant](https://www.vagrantup.com/), [VirtualBox](https://www.virtualbox.org/), and *OpenSSH*:

*Notice*: If you have *PUTTY* ssh installed, you might need to move *OpenSSH* before *PUTTY* in **PATH**

```bat
:: elevated CMD (with Administrator rights):

choco install virtualbox
choco install vagrant
choco install openssh
```

Since virtual machines are taking a lot of disk space, you probably want to move them out of system drive.

To do that with *VirtualBox*, open up `Oracle VM VirtualBox` manager and press `Settings` button. There select `General` and adjust vm location.

To move *Vagrant* files to another drive, you need to change **VAGRANT_HOME** env variable:

![Changing VAGRANT_HOME](/doc/vagrant_home.png?raw=true "Changing VAGRANT_HOME")


Set up *Vagrant*:

```bat
:: ordinal CMD (without Administrator rights):

vagrant plugin install vagrant-vbguest
```

## Build & Run

Firstly finish `Vagrant setup` section.

Then `cd` into project root directory.

Then start up vagrant (this will take ~25-30 min for first start-up, it will be much faster for next start-ups):

```bat
vagrant up
```

`vagrant up` command makes Vagrant to launch virtual machine, set up all builds, watches and dev servers. You are ready to go! Open `http://localhost:8000` in your browser.

To debug with *VSCode*:

Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension.

Open project in *VSCode*, press `ctrl-shift-d`, select `Both` for launch configuration and press `f5`.

## Advanced: Build & Run

For more precise control, after `vagrant up` you can ssh into virtual machine by using

```bat
vagrant ssh
```

While you are in ssh, you can do other commands, listed below (or simply do `npm run` to get list of available scripts to run).

### Build

*Warn*: Don't forget to `vagrant ssh`

```bat
NODE_ENV=development
npm run build:vendor
npm run build
```

### Start dev server

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run watch:dev
```

### Run unit tests

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run test:unit
```

### Run e2e tests

*Warn*: Don't forget to `vagrant ssh`

*Notice*: First start will take quite a bit of time because it downloads selenium and chrome driver.

```bat
npm run test:e2e
```

### Run all tests

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run test
```

### Production build

*Warn*: Don't forget to `vagrant ssh`

```bat
NODE_ENV=production
npm run build:vendor
npm run build
```

### Clean

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run clean
```

### Clean distributable files

*Warn*: Don't forget to `vagrant ssh`

```bat
npm run clean:dist
```

