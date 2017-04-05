# PasswordKeeper

Simple storage for passwords.

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

Install Java 8 SDK.

```bat
choco install jdk8
```

From elevated CMD (with Administrator rights):

```bat
npm install --global --production windows-build-tools
```

From usual CMD:

```bat
npm install --global webdriverio wdio-jasmine-framework wdio-selenium-standalone-service
```

## Build & Run

Then additional requirements:

```bat
npm install -g webpack local-web-server karma-cli typings
npm install
```

Build

```bat
set NODE_ENV=development
npm run build
```

Start dev server

```bat
npm run dev
```

Run unit tests

```bat
npm run unit-test
```

Run e2e tests

```bat
npm run dev
npm run e2e-test
```

Run all tests

```bat
npm run dev
npm run all-test
```

## Usual development workflow

```bat
set NODE_ENV=development
npm run dev
npm run build-watch
npm run build-watch:unit-test
npm run unit-test-watch
```

Open `localhost:8000` in browser.

## Production build

```bat
set NODE_ENV=production
npm run build
```

## Clean

```bat
npm run clean
```