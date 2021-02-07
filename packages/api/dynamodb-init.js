import AWS from 'aws-sdk'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import { Table } from 'dynamodb-toolbox'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, NODE_ENV } = process.env

if (NODE_ENV !== 'test' && (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY)) {
  const credentials = new AWS.SharedIniFileCredentials({ profile: 'civ6_dev' })
  AWS.config.credentials = credentials
}

const dynamoDbConfig = {
  region: 'us-west-2',
}

if (process.env.MOCK_DYNAMODB_ENDPOINT) {
  dynamoDbConfig.endpoint = process.env.MOCK_DYNAMODB_ENDPOINT
  dynamoDbConfig.sslEnabled = false
  dynamoDbConfig.region = 'local'
}

export const dynamoDbDocumentClient = new DynamoDB.DocumentClient(dynamoDbConfig)

export const MainTable = new Table({
  name: process.env.MAIN_TABLE,
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient: dynamoDbDocumentClient,
  indexes: {
    GSI1: { partitionKey: 'sk', sortKey: 'data' },
  },
})
