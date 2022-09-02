## Description

This is a project meant to make card tracking, deck building, and general planning easier for the GBA game 'Yu-Gi-Oh! The Eternal Duelist Soul'. Code and tools being used include NestJS and MongoDB for the backend and Angular for the frontend. Why am I making this? For fun, of course!

An API built on the [NestJS framework](https://nestjs.com/).

## Installation

```bash
$ npm install
```

### MongoDB

You will need MongoDB 5.0 or higher. You can either install it directly, or via Docker (with `docker-compose`).

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### General Guidelines

* Do not return a bare array as a Controller result. Always prefer to return an object with some property in it. This will make it much easier to add metadata if needed to these API responses.
* Add a small documentation comment for each Service method.

### Nest CLI tips
* see [Command Overview](https://docs.nestjs.com/cli/overview#command-overview)
* General CLI Commands
```bash
nest --help
```
* Specific CLI Commands, sub any command for 'generate' below
```bash
nest generate --help
```
