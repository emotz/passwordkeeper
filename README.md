# PasswordKeeper

Simple storage for passwords.

## Tech description

Front-end source files are located at `fe/src`.

Front-end unit-test specifications are located at `fe/tests`.

End-to-end tests specifications are located at `e2e-tests`.

`Webpack` is used to precompile js scripts and bundle them into single giant js at `fe/dist`. This directory also contains a bunch of precompiled fonts required for `bootstrap` and `index.html` which is an entry point for our SPA app. Webpack config file is `fe/webpack.config.js`.

Development server is `local-web-server`. It is simple http server, designed to be easily mockable and configurable for easy startup. Its config file along with registered routes is `fe/local-web-server.json`. Route-handlers are located at `fe/mocks`.

`Karma` is used to run unit-tests for front-end. Its config file is `fe/karma.conf.js`. It also uses `webpack` to precompile tests, but it doesnt use `fe/webpack.config.js` for that; instead, `fe/karma.conf.js` has section for unit-test related webpack configuration.

`Nightwatch` is used to run end-to-end tests (full-stack tests). It uses Selenium as engine.

## Build & Run

Install [nightwatch](http://nightwatchjs.org/getingstarted#installation)

Put selenium-related jars and driver exe into `bin` directory in the root.

Then additional requirements:

```bat
npm install -g webpack local-web-server lodash karma-cli
npm install
npm link lodash
```

Build

```bat
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