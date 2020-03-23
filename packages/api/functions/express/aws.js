import AWS from 'aws-sdk'
import dynamo from 'dynamodb'

const baseConfig = {
  region: 'us-east-1',
  convertEmptyValues: true,
}
const dynamodbOfflineOptions = {
  ...baseConfig,
  region: 'localhost',
  endpoint: 'http://localhost:889',
}

const dynamoDb = process.env.IS_OFFLINE ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions) : new AWS.DynamoDB.DocumentClient(baseConfig)
dynamo.documentClient(dynamoDb)

// dynamo.AWS.config.loadFromPath('credentials.json')
dynamo.AWS.config.update({
  region: 'us-east-1',
})
