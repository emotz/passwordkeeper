# PasswordKeeper

Simple storage for passwords. Uses VueJS for front-end.

## Tech description

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

## e2e tests set up

*Optional*: Install choco - package manager for Windows:

```bat
:: elevated CMD (with Administrator rights):

@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
refreshenv
```

Install Java 8 SDK and NodeJS (e.g. with choco) and Visual C++ Build Tools:

```bat
:: elevated CMD (with Administrator rights):

choco install jdk8
choco install nodejs
refreshenv
npm install --global --production windows-build-tools
refreshenv
```

And then install WebDriverIO and related tools:

```bat
:: usual cmd (without Administrator rights):

npm install --global webdriverio wdio-jasmine-framework wdio-selenium-standalone-service
```

## Build & Run

First finish `e2e tests set up` section.

Then additional requirements:

```bat
npm install -g webpack webpack-runner local-web-server karma-cli typings
:: then close cmd window and open it again
npm install
```

### Build

```bat
set NODE_ENV=development
npm run build:vendor
npm run build
```

### Start dev server

```bat
npm run watch:dev
```

### Run unit tests

```bat
npm run build:vendor
npm run test:unit
```

### Run e2e tests

```bat
npm run watch:dev
npm run build:vendor
npm run build
npm run test:e2e
```

### Run all tests

```bat
npm run watch:dev
npm run build:vendor
npm run build
npm run test:all
```

### Production build

```bat
set NODE_ENV=production
npm run build
```

### Clean

```bat
npm run clean
```

### Clean distributable files

```bat
npm run clean:dist
```

## Usual development workflow

```bat
set NODE_ENV=development
npm run watch:dev
npm run build:vendor
npm run watch:build
npm run watch:build:test:unit
npm run watch:test:unit
```

Open `localhost:8000` in browser.
