import 'source-map-support/register'
import { configure } from 'aws-serverless-express'
import app from './app'
import { log, addLogMetadata } from '../../utils/logger'

const respondWithErrors = process.env.NODE_ENV === 'development'
const servererlessExpress = configure({ app, logger: log, respondWithErrors })

export const handler = (event, context) => {
  addLogMetadata({ metadata: { awsRequestId: context.awsRequestId }})
  return servererlessExpress.handler(event, context)
}

export const server = servererlessExpress.server
