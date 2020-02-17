require('dotenv').config()
const fetch = require('node-fetch')

const {
  DISCORD_WEBHOOK_URL,
  API_GATEWAY_ENDPOINT,
} = process.env

const WEBHOOK_REQUEST_VALUE = {
  value1: 'Game Name',
  value2: 'Player Name',
  value3: Math.round(Math.random(0, 100) * 100).toString(),
}
async function main() {
  // fetch(`${API_GATEWAY_ENDPOINT}?discordWebhook=FAIL${discordWebhook}`, {
  //   body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
  //   method: 'POST',
  //   headers: { 'content-type': 'application/json' },
  // })
  const response = await fetch(`${API_GATEWAY_ENDPOINT}?discordWebhook=${DISCORD_WEBHOOK_URL}`, {
    body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
  const responseBody = await response.text()
  console.log(responseBody)
}

main()
