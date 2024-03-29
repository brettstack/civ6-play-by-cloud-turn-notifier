# Civ 6 Play By Cloud Webhook

This project is a hosted service for Civilization 6's Play By Cloud game format, for notifying players in Discord when it's their turn. The service is available at [https://civ.halfstack.software](https://civ.halfstack.software).

Having issues? Reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

## Made with <a href="https://codegenie.codes">Code Genie</a>

Starting a new software project? Check out Code Genie - a <a href="https://codegenie.codes">Full Stack App Generator</a> that generates source code based on your project's data model. Including:

1. A React Next.js Web App hosted on Amplify Hosting
1. Serverless Express REST API running on API Gateway and Lambda
1. Cognito User Pools for Identity/Authentication
1. DynamoDB Database
1. Cloud Development Kit (CDK) for Infrastructure as Code (IAC)
1. Continuous Integration/Delivery (CI/CD) with GitHub Actions
1. And more!

## Development

Below is for development purposes only. If you're having problems using the service, reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

### Architecture

![architecture diagram](https://raw.githubusercontent.com/brettstack/civ6-play-by-cloud-turn-notifier/master/architecture-diagram.png)

### Deploy to AWS

Update your `~/.aws/credentials` with a profile called `[civ6_dev]` and run the following

```shell
cd packages/api
npm i
cd ../ui
npm i
cd ../..
npm run deploy:dev
```

Update the values in `packages/ui/.env.development` with the relevant values from `stack-outputs.development.json`


### Testing

#### Running unit tests

`npm test`

#### Sending a test request to the service

1. Copy `.env.development.example` to a `.env.development` file and update it with your Discord Webhook URL
2. Run `node packages/api/scripts/send-webhook-request.js`

### Setup

#### Domain

To use a custom domain, you must first manually create two certificates via Amazon Certificate Manager - one for UI, and another for API. For production, create certificates for `example.com` and `api.example.com`. For staging, create certificates for `staging.example.com` and `staging.api.example.com`.

After the stack is successfully deployed, create CNAME records in your DNS settings for both API and UI:

1. API:
   1. Navigate to Custom domain names in the API Gateway Console
   1. Copy `API Gateway domain name` from the API Gateway console into `Domain name` in DNS Settings
   1. Specify the subdomain in the `@` field (e.g. `api.civ` or `staging.api.civ`)
   1. This takes time to propagate
1. UI:
   1. Navigate to Domain management in the Amplify Console
   1. Click Actions -> View DNS Records
   1. Create two CNAME records as descsribed