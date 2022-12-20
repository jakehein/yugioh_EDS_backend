## Description

This is a project meant to make card tracking, deck building, and general planning easier for the GBA game 'Yu-Gi-Oh! The Eternal Duelist Soul'. Code and tools being used include NestJS and MongoDB for the backend and Angular for the frontend. Why am I making this? For fun, of course!

All code is self-written from my experience with NestJS and MongoDB. This project is Open Source, and anyone is free to clone, watch, and fork from this project.

An API built on the [NestJS framework](https://nestjs.com/).

## Installation

```bash
$ npm install
```

### MongoDB

To run this locally, you will need MongoDB 5.0 or higher. You can either install it directly, or via [Docker](https://www.docker.com/products/docker-desktop/).

```bash
# Create and start containers
$ docker compose up -d
# Stop and remove containers
$ docker compose down
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Setting Up Authentication

I'm using Firebase for authentication. To set that up, [sign in here](https://console.firebase.google.com/u/0/) and create a new project. Afterwards, go to the Settings area of the project, then Project Settings. You should be in the General tab, but if not, switch over to it. In here, `Project ID` is what you will need for `FIREBASE_PROJECT_ID` (see `Environment Variables`).

You will also need to make a service account. To do so, go to the Service accounts tab, and hit `Generate new private key`. This will give you a JSON file that you need for `FIREBASE_SERVICE_ACCOUNT_JSON` (see `Environment Variables`), but it will need to be slightly transformed first. The JSON needs to be minified (all newlines removed), and that can be done for example with a tool like [json minifier](https://codebeautify.org/jsonminifier) (although, a more secure alternative is preferred).

### Environment Variables

Create a file called `.env.local` in the root of the project.

The following values are required:

- `FIREBASE_PROJECT_ID` - see `Setting Up Authentication`
- `FIREBASE_SERVICE_ACCOUNT_JSON` - see `Setting Up Authentication`

The following values are optional:

- `PORT` - set to the port you want to run the API on. Defaults to `3000`
- `MONGO_URL` - set to the url of the MongoDB instance. If not set, defaults to `mongodb://root:localdev@localhost:27017/`

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

- Do not return a bare array as a Controller result. Always prefer to return an object with some property in it. This will make it much easier to add metadata if needed to these API responses.
- Add a small documentation comment for each Service method.

### Nest CLI tips

- see [Command Overview](https://docs.nestjs.com/cli/overview#command-overview)
- General CLI Commands

```bash
nest --help
```

- Specific CLI Commands, sub any command for 'generate' below

```bash
nest generate --help
```
