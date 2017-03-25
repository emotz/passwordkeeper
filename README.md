# PasswordKeeper

Simple storage for passwords.

## Build & Run

Install [nightwatch](http://nightwatchjs.org/getingstarted#installation)

Put selenium-related jars into `bin` directory in the root.

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