module.exports = {
  tables: [
    {
      TableName: process.env.GAME_TABLE,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      data: [
        {
          id: 'invalid-discord-webhook-protocol',
          discordWebhookUrl: 'hsdfttps://discordapp.com/api/webhooks/invalid',
        },
        {
          id: 'd096960f-d4ac-44be-ab1b-aa415b73ff7f',
          discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdfghjkl',
        },
        {
          id: 'invalid-discord-webhook-url',
          discordWebhookUrl: 'https://discordapp.com/api/webhooks/invalid',
        },
        {
          id: 'deleted-discord-webhook-url',
          discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasddeleted',
        },
        {
          id: 'no-discord-webhook-url',
        },
        {
          id: 'inactive-game',
          discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdinactive',
          state: 'INACTIVE'
        },
        {
          id: 'existing-game',
          discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdinactive',
          state: 'INACTIVE'
        },
      ],
    },
  ],
  basePort: 8000,
};
