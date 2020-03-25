# Civilization VI Turn Notifier

A hosted service for Civilization VI's Play By Cloud game format, for notifying players in Discord when it's their turn. Simply create a Webhook in your Discord Channel, and use this URL `https://api.civ.halfstack.software/webhook?gameId=GAME_ID` in your Civilization VI game settings..

Having issues? Reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

## Development

Below is for development purposes only. If you're having problems using the service, reach out to me on Twitter [@AWSBrett](https://twitter.com/AWSbrett) or open a GitHub Issue.

### Architecture

![architecture diagram](https://raw.githubusercontent.com/brettstack/civ6-play-by-cloud-turn-notifier/master/architecture-diagram.png)

### Testing

## Running unit tests

`npm test`

#### Sending a test request to the service

1. Copy `.env.sample` to a `.env` file in the root directory and update it with your Discord Webhook URL
2. Run `node packages/webhook/scripts/send-webhook-request.js`

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