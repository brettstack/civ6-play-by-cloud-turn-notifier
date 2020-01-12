jest.mock('node-fetch')

const fetch = require('node-fetch')

const { Response, Headers } = jest.requireActual('node-fetch')

const { webhookHandler } = require('./handler')

describe('webhookHandler: happy paths ', () => {
  test('Works', async () => {
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdfghjkl;',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).resolves.toEqual({
      successCount: 1,
      failCount: 0,
    })
  })
})

describe('webhookHandler: unhappy paths ', () => {
  test('Fails on an invalid event object', async () => {
    await expect(webhookHandler({})).rejects.toThrow('Lambda didn\'t receive a `Records` array')
  })

  test('Rejected count increases on fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Only HTTP(S) protocols are supported'))

    const failReasons = ['Only HTTP(S) protocols are supported']
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'hsdfttps://discordapp.com/api/webhooks/invalid',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).resolves.toEqual({
      successCount: 0,
      failCount: 1,
      failReasons,
    })
  })

  test('Rejected count increases on non-2xx HTTP status code', async () => {
    const meta = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    }
    const headers = new Headers(meta)
    const responseInit = {
      status: 400,
      statusText: '{ message: \'400\' }',
      headers,
    }
    const responseBody = { message: '400' }

    const response = new Response(JSON.stringify(responseBody), responseInit)
    fetch.mockResolvedValueOnce(Promise.resolve(response))
    const failReasons = ['HTTP response not ok: 400 {"message":"400"}']
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'https://discordapp.com/api/webhooks/invalid',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).resolves.toEqual({
      successCount: 0,
      failCount: 1,
      failReasons,
    })
  })
})
