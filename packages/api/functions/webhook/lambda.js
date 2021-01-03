import 'source-map-support/register'
import fetch from 'node-fetch'
import middy from '@middy/core'
import sqsPartialBatchFailureMiddleware from '@middy/sqs-partial-batch-failure'
// import sampleLogging from '@dazn/lambda-powertools-middleware-sample-logging'
// import captureCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids'
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout'
// import '../../aws'
import { getGame, markGameInactive } from '../../controllers/game'
import { log, addLogMetadata } from '../../utils/logger'

export const MESSAGE_TEMPLATE = `{{playerName}}, it's your turn.
Turn: {{turnNumber}}
Game: {{gameName}}`
const BOT_USERNAME = 'Civ6 Turnbot'
const AVATAR_URL = 'http://www.megabearsfan.net/image.axd/2017/8/CivVI-JohnCurtin_250x250.png'

export async function webhookHandler(event, context) {
  addLogMetadata({ metadata: {awsRequestId: context.awsRequestId }})
  log.debug('WEBHOOK_HANDLER:CALLED_WITH', { event })

  const { Records } = event

  if (!Records || !Array.isArray(Records)) {
    throw new Error(`Lambda didn't receive a \`Records\` array in the \`event\` object. Records: ${Records}.`)
  }

  const recordPromises = Records.map(processMessage)

  return Promise.allSettled(recordPromises)
}

async function processMessage(record, index) {
  log.debug('PROCESS_MESSAGE:CALLED_WITH', { index, record })

  const {
    messageId,
    body,
    messageAttributes,
  } = record

  if (!messageId) {
    throw new Error(`Record is missing \`messageId\`. Index: ${index}.`)
  }

  // TODO: Check if `messageId` has been processed

  if (!body) {
    throw new Error(`Record is missing \`body\`. Index: ${index}.`)
  }

  const bodyJson = JSON.parse(body)

  log.debug('PROCESS_MESSAGE:MESSAGE_BODY_JSON', bodyJson)

  const {
    gameId,
    botUsername,
    avatarUrl,
    messageTemplate,
  } = getMessageAttributeStringValues({ messageAttributes })

  log.debug('PROCESS_MESSAGE:MESSAGE_ATTRIBUTE_STRING_VALUES', {
    gameId,
    botUsername,
    avatarUrl,
    messageTemplate,
  })

  if (!gameId) {
    throw new Error(`\`Record is missing \`messageAttributes.gameId\`. Index: ${index}.`)
  }

  const {
    value1: gameName,
    value2: playerName,
    value3: turnNumber,
  } = bodyJson

  log.debug('PROCESS_MESSAGE:VALUES_FROM_CIV', {
    gameName,
    playerName,
    turnNumber,
  })

  const game = await getGame({
    gameId,
    includeDiscordWebhookUrl: true
  })

  if (!game) {
    log.info('PROCESS_MESSAGE:NO_GAME_FOUND', { gameId })

    return `No game found. Game ID: ${gameId}.`
  }

  log.debug('PROCESS_MESSAGE:GAME', { game })

  const {discordWebhookUrl, players, state} = game

  log.debug('PROCESS_MESSAGE:GAME_VALUES', { discordWebhookUrl, players, state })

  if (state === 'INACTIVE') {
    log.info('PROCESS_MESSAGE:SKIP_INACTIVE', { gameId })

    return `Skipping inactive game. Game ID: ${gameId}.`
  }

  if (!discordWebhookUrl) {
    log.info('PROCESS_MESSAGE:NO_DISCORD_WEBHOOK_URL', { game })
    
    await markGameInactive({ gameId })

    return `Game doesn't have \`discordWebhookUrl\`. Marked as inactive. Game ID: ${gameId}`
  }

  const messageFromTemplate = getMessageFromTemplate({
    messageTemplate,
    gameName,
    playerName,
    turnNumber,
    players,
  })

  log.debug('PROCESS_MESSAGE:MESSAGE_FROM_TEMPLATE', { messageFromTemplate })

  const targetWebhookBody = {
    username: botUsername,
    avatar_url: avatarUrl,
    content: messageFromTemplate,
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

  log.debug('PROCESS_MESSAGE:DISCORD_REQUEST_BODY', { targetWebhookBody })

  const response = await fetch(discordWebhookUrl, {
    body: JSON.stringify(targetWebhookBody),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  log.debug('PROCESS_MESSAGE:RESPONSE', { response })

  const responseText = await response.text()

  log.debug('PROCESS_MESSAGE:RESPONSE_TEXT', { responseText })

  if (!response.ok) {
    log.debug('PROCESS_MESSAGE:RESPONSE_NOT_OK', { game, response, responseText })

    try {
      const responseJson = JSON.parse(responseText)

      log.debug('PROCESS_MESSAGE:RESPONSE_NOT_OK_JSON', { responseJson })

      const discordWebhookDoesntExist = responseJson.code === 10015

      if (discordWebhookDoesntExist) {
        log.info('PROCESS_MESSAGE:DISCORD_WEBHOOK_DOESNT_EXIST', { game })

        await markGameInactive({ gameId })

        return `Discord Webhook doesn't exist for this Game. Marked as inactive. Game ID: ${gameId}. Discord Webhook URL: ${discordWebhookUrl}`
      }
    } catch(error) {
      log.error('PROCESS_MESSAGE:ERROR_PROCESSING_NOT_OK_RESPONSE', { game, stack: error.stack, errorMessage: error.message })
    }

    throw new Error(`HTTP response from Discord not ok. Status: ${response.status}; Text: ${responseText}.`)
  }

  log.info(`PROCESS_MESSAGE:NOTIFICATION_SENT`, { gameId, responseText})

  return `Notifaction sent. Game ID: ${gameId}; Discord Response Text: ${responseText}.`
}

export function getMessageFromTemplate({
  messageTemplate,
  gameName,
  playerName,
  turnNumber,
  players = {},
  playerNameOrDiscordUserId = getDiscordUserId({
    players,
    playerName,
  }),
}) {
  return messageTemplate
    .replace(/{{gameName}}/g, gameName)
    .replace(/{{playerName}}/g, playerNameOrDiscordUserId)
    .replace(/{{turnNumber}}/g, turnNumber)
}

export function getDiscordUserId({
  players = {},
  playerName,
}) {
  const discordUserId = players && players[playerName] && players[playerName].discordUserId

  // Default to using playerName if no discordUserId is set, or discordUserId is invalid (non-numerical)
  let playerNameOrDiscordUserId = playerName

  if (discordUserId) {
    // correct format for @ing someone on Discord
    if (/^<@\d+>$/.test(discordUserId)) playerNameOrDiscordUserId = discordUserId

    // includes @ prefix only: wrap in <>
    else if (/^@\d+$/.test(discordUserId)) playerNameOrDiscordUserId = `<${discordUserId}>`

    // account number only: wrap in <@>
    else if (/^\d+$/.test(discordUserId)) playerNameOrDiscordUserId = `<@${discordUserId}>`
  }

  return playerNameOrDiscordUserId
}

function getMessageAttributeStringValues({ messageAttributes }) {
  const messageAttributeValues = {
    botUsername: BOT_USERNAME,
    avatarUrl: AVATAR_URL,
    messageTemplate: MESSAGE_TEMPLATE,
  }

  Object.entries(messageAttributes).forEach(([key, value]) => {
    messageAttributeValues[key] = value.stringValue
  })

  return messageAttributeValues
}
export const webhookHandlerMiddy = middy(webhookHandler)

webhookHandlerMiddy
  // .use(captureCorrelationIds({
  //   sampleDebugLogRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(sampleLogging({
  //   sampleRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(logTimeout())
  .use(sqsPartialBatchFailureMiddleware())
