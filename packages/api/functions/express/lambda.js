import 'source-map-support/register'
import serverless from 'serverless-http'
import app from './app'
import '../../aws'

export const handler = serverless(app, {
  request(request, event) {
    request.requestContext = event.requestContext
  },
})
