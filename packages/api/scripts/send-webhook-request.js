require('dotenv').config()
const fetch = require('node-fetch')

const {
  GAME_ID,
  API_GATEWAY_ENDPOINT,
} = process.env

const WEBHOOK_REQUEST_VALUE = {
  value1: 'Free-for-all',
  value2: 'Brett',
  value3: Math.round(Math.random(0, 100) * 100).toString(),
}
async function main() {
  const response = await fetch(`${API_GATEWAY_ENDPOINT}webhook?gameId=${GAME_ID}`, {
    body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
  const responseBody = await response.text()
  console.log(responseBody)
}

main()
