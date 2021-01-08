import 'source-map-support/register'
import { configure } from '@vendia/serverless-express'
import app from './app'
import { log, addLogMetadata } from '../../utils/logger'

const servererlessExpress = configure({ app, log })

export const handler = (event, context) => {
  addLogMetadata({ metadata: { awsRequestId: context.awsRequestId }})
  return servererlessExpress.handler(event, context)
}