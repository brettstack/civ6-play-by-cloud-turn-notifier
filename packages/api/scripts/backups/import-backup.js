const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const DynamoDB = require('aws-sdk/clients/dynamodb')
const { Table, Entity } = require('dynamodb-toolbox')
const backupJson = require('./backup.json')

const GAME_TABLE = 'civ6-pbc-production-GameTable-BK8V643LNDTF'
const credentials = new AWS.SharedIniFileCredentials({ profile: 'civ6_prod' })
AWS.config.credentials = credentials

const dynamoDbConfig = {
  region: 'us-west-2',
}
const dynamoDbDocumentClient = new DynamoDB.DocumentClient(dynamoDbConfig)

const GameTable = new Table({
  name: GAME_TABLE,
  partitionKey: 'id',
  DocumentClient: dynamoDbDocumentClient,
})

const Game = new Entity({
  name: 'Game',
  attributes: {
    id: {
      partitionKey: true,
    },
    discordWebhookUrl: {
      type: 'string',
      required: true,
    },
    players: {
      type: 'map',
    },
    state: {
      type: 'string',
    },
  },
  table: GameTable,
})
const skipped = []
backupJson.forEach((i) => {
  const item = i.Item

  if (item.updatedAt && !item._md) {
    item._md = item.updatedAt
  }

  if (item.createdAt && !item._ct) {
    item._ct = item.createdAt
  }

  if (!item.discordWebhookUrl) {
    // console.warn('No discordWebhookUrl; skipping', item)
    skipped.push(i)
    return
  }
  console.info(item)
  const itemToWrite = {
    id: item.id.S,
    discordWebhookUrl: item.discordWebhookUrl.S,
    players: getPlayersArray(item.players),
    state: item.state?.S,
    _ct: item._ct?.S,
    _md: item._md?.S,
  }

  console.info(itemToWrite)
  Game.put(itemToWrite)
})

fs.writeFileSync(path.resolve(__dirname, 'skipped.json'), JSON.stringify(skipped))

function getPlayersArray(players) {
  if (!players) return undefined
  const playersObject = {}
  Object.entries(players.M).forEach(([playerName, playerValue]) => {
    playersObject[playerName] = {
      discordUserId: playerValue.M.discordUserId.S
    }
  })
  return playersObject
}