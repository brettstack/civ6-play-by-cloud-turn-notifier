# Civ 6 Play By Cloud Webhook

This project is a hosted service for Civilization 6's Play By Cloud game format, for notifying players in Discord when it's their turn. The service is available at [https://civ.halfstack.software](https://civ.halfstack.software).

Having issues? Reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

## Development

Below is for development purposes only. If you're having problems using the service, reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

### Architecture

![architecture diagram](https://raw.githubusercontent.com/brettstack/civ6-play-by-cloud-turn-notifier/master/architecture-diagram.png)

### Local development

Start the individual services in separate terminals:

```shell
cd packages/db
npm run start:dev
```

```shell
cd packages/api
npm run start:dev
```

```shell
cd packages/ui
npm run start:dev
```

### Deploying the project

Ensure you have AWS CLI set up correctly with credentials set to your desired account, then deploy the `api` and `db` packages:

```
cd packages/api
npm i
npm run deploy
cd ../db
npm i
npm run deploy
cd ../ui
npm i
npm run deploy
```

After `api` and `db` are deployed to AWS, you can run the UI locally using `npm start`.

### Testing

#### Running unit tests

`npm test`

#### Sending a test request to the service

1. Copy `.env.sample` to a `.env` file in the root directory and update it with your Discord Webhook URL
2. Run `node packages/api/scripts/send-webhook-request.js`

### Setup

#### Domain

1. After deploying the stack, run `sls create_domain` to create the API Gateway Custom Domain.
2. Run `npm run deploy` again to create the base path mappings
3. In DNS settings, create a CNAME record, 
   1. Specify the subdomain in the `@` field (e.g. `civ`)
   2. Copy `Target Domain Name` from the API Gateway console into `Target Domain`
   3. This takes time to propagate

## See also

https://glitch.com/edit/#!/civ6-cloud-hook-to-distord?path=server.js:9:0