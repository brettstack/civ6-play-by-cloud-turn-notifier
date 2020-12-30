import 'source-map-support/register'
import { configure } from 'aws-serverless-express'
import app from './app'
import logger from '../../utils/logger'

const log = logger.child({ awsRequestId: null })
const respondWithErrors = process.env.NODE_ENV === 'development'
const servererlessExpress = configure({ app, logger: log, respondWithErrors })

export const handler = servererlessExpress.handler
export const server = servererlessExpress.server
