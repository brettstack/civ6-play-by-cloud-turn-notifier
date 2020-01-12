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
// const URL = `http://localhost:3000/games/${API_KEY}/webhooks/turn`
const discordWebhook = `https://discordapp.com/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_WEBHOOK_TOKEN}`
const URL = `https://5wl90026q6.execute-api.us-east-1.amazonaws.com/dev?discordWebhook=${discordWebhook}`
async function main() {
  const response = await fetch(URL, {
    body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
    method: 'POST',
    // mode: 'cors',
    headers: { 'content-type': 'application/json' },
  })
  const json = await response.json()
  console.info(json)
}

main()
