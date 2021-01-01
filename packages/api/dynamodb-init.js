import AWS from 'aws-sdk'
import DynamoDB from 'aws-sdk/clients/dynamodb'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, NODE_ENV } = process.env

if (NODE_ENV != 'test' && (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY)) {
  const credentials = new AWS.SharedIniFileCredentials({profile: 'civ6_dev'})
  AWS.config.credentials = credentials
}

const dynamoDbConfig = {
  region: 'us-west-2',
}
export const dynamoDbDocumentClient = new DynamoDB.DocumentClient(dynamoDbConfig)

export const MainTable = new Table({
  name: process.env.MAIN_TABLE,
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient: dynamoDbDocumentClient,
  indexes: {
    GSI1: { partitionKey: 'sk', sortKey: 'data' },
  }
})