const path = require('path')

const dotenvPath = path.resolve(__dirname, '../.env.development')
require('dotenv').config({ path: dotenvPath })
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
  const endpoint = `webhook?gameId=${GAME_ID}`
  const url = `${API_GATEWAY_ENDPOINT}/${endpoint}`

  const response = await fetch(url, {
    body: JSON.stringify(WEBHOOK_REQUEST_VALUE),
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
  const responseBody = await response.text()
  console.log(responseBody)
}

main()
