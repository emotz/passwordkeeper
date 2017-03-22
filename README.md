# PasswordKeeper

Simple storage for passwords.

## Build & Run

Install [nightwatch](http://nightwatchjs.org/getingstarted#installation)

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

Run tests

```bat
npm run test
```

Run e2e tests

```bat
npm run dev
npm run e2e-test
```

Run all tests

```bat
npm run dev
npm run alltest
```