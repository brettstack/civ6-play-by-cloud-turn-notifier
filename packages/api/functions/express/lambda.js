import 'source-map-support/register'
import { configure } from 'aws-serverless-express'
import app from './app'
import logger from '../../utils/logger'

let log = logger.child({ awsRequestId: null })

const servererlessExpress = configure({ app, logger: log })
export const handler = servererlessExpress.handler
export const server = servererlessExpress.server
