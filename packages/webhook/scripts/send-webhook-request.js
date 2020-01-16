require('dotenv').config()
const fetch = require('node-fetch')

const {
  DISCORD_WEBHOOK_ID,
  DISCORD_WEBHOOK_TOKEN,
} = process.env

const WEBHOOK_REQUEST_VALUE = {
  value1: 'Game Name',
  value2: 'Player Name',
  value3: Math.round(Math.random(0, 100) * 100).toString(),
}
const discordWebhook = `https://discordapp.com/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_WEBHOOK_TOKEN}`
const API_GATEWAY_ENDPOINT = 'https://5wl90026q6.execute-api.us-east-1.amazonaws.com/dev'
async function main() {
  // fetch(`${API_GATEWAY_ENDPOINT}?discordWebhook=FAIL${discordWebhook}`, {
  //   body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
  //   method: 'POST',
  //   headers: { 'content-type': 'application/json' },
  // })
  fetch(`${API_GATEWAY_ENDPOINT}?discordWebhook=${discordWebhook}`, {
    body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
}

main()
