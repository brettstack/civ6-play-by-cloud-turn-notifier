# Civilization 6 Turn Notifier

## Architecture

![architecture diagram](https://raw.githubusercontent.com/brettstack/civ6-play-by-cloud-turn-notifier/master/architecture-diagram.jpg)

## Usage

The initial version simply posts to a Discord channel, and to hook it up you just need to:

1. Create a webhook in your Discord channel via the channel settings
2. Copy the webhook URL and slap it on the end of this URL https://civ.halfstack.software?discordWebhookUrl=DISCORD_WEBHOOK_URL
3. Paste that URL into the Civ6 settings

## Testing

### Sending a test request to the service

1. Copy `.env.sample` to a `.env` file in the root directory and update it with your Discord Webhook URL
2. Run `node packages/webhook/scripts/send-webhook-request.js`

## Setup

# Domain

1. After deploying the stack, run `sls create_domain` to create the API Gateway Custom Domain.
2. Run `npm run deploy` again to create the base path mappings
3. In DNS settings, create a CNAME record, 
   1. Specify the subdomain in the `@` field (e.g. `civ`)
   2. Copy `Target Domain Name` from the API Gateway console into `Target Domain`
   3. This takes time to propagate
