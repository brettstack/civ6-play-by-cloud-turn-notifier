import 'source-map-support/register'
// import Discord from 'discord.js'
import fetch from 'node-fetch'
import middy from '@middy/core'
import sqsPartialBatchFailureMiddleware from '@middy/sqs-partial-batch-failure'
// import sampleLogging from '@dazn/lambda-powertools-middleware-sample-logging'
// import captureCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids'
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout'
import '../../aws'
import Game from '../../models/Game'

export async function webhookHandler(event) {
  const { Records } = event

  if (!Records || !Array.isArray(Records)) {
    throw new Error(`Lambda didn't receive a \`Records\` array in the \`event\` object. Received: ${Records}.`)
  }

  const recordPromises = Records.map(processMessage)

  return Promise.allSettled(recordPromises)
}

async function processMessage(record, index) {
  const {
    messageId,
    body,
    messageAttributes,
  } = record

  if (!messageId) {
    throw new Error(`Records[${index}] is missing \`messageId\`.`)
  }

  // TODO: Check if `messageId` has been processed

  if (!body) {
    throw new Error(`Records[${index}].body is missing.`)
  }

  const bodyJson = JSON.parse(body)

  const {
    gameId,
    botUsername,
    avatarUrl,
    messageTemplate,
  } = getMessageAttributeStringValues({ messageAttributes })


  if (!gameId) {
    throw new Error(`\`Records[${index}].messageAttributes.gameId\` is missing.`)
  }

  const {
    value1: gameName,
    value2: playerName,
    value3: turnNumber,
  } = bodyJson
  const message = getMessageFromTemplate({
    messageTemplate,
    gameName,
    playerName,
    turnNumber,
  })
  const targetWebhookBody = {
    username: botUsername,
    avatar_url: avatarUrl,
    content: message,
    /*
    // TODO: Add Civ6 memes
    "embeds": [
      {
        "image": {
          "url": avatarUrl
        }
      }
    ]
    */
  }
  // const hook = new Discord.WebhookClient('webhook id', 'webhook token')
  // Use \@username to get user id in slack channel
  const game = await Game.get(gameId)
  const discordWebhookUrl = game.get('discordWebhookUrl')
  const response = await fetch(discordWebhookUrl, {
    body: JSON.stringify(targetWebhookBody),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`HTTP response not ok: ${response.status} ${responseText}`)
  }

  return responseText
}

function getMessageFromTemplate({
  messageTemplate,
  gameName,
  playerName,
  turnNumber,
}) {
  return messageTemplate
    .replace(/{{gameName}}/g, gameName)
    .replace(/{{playerName}}/g, playerName)
    .replace(/{{turnNumber}}/g, turnNumber)
}

function getMessageAttributeStringValues({ messageAttributes }) {
  const messageAttributeValues = {
    botUsername: 'Civ6 Turnbot',
    avatarUrl: 'http://www.megabearsfan.net/image.axd/2017/8/CivVI-JohnCurtin_250x250.png',
    messageTemplate: `{{playerName}}, it's your turn.
Turn: {{turnNumber}}
Game: {{gameName}}`,
  }

  Object.entries(messageAttributes).forEach(([key, value]) => {
    messageAttributeValues[key] = value.stringValue
  })

  return messageAttributeValues
}
const handler = middy(webhookHandler)

handler
  // .use(captureCorrelationIds({
  //   sampleDebugLogRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(sampleLogging({
  //   sampleRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(logTimeout())
  .use(sqsPartialBatchFailureMiddleware())
