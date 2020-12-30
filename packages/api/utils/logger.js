import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: new transports.Console({
    handleExceptions: true,
    handleRejections: true,
  }),
})

let logMetadata = { awsRequestId: null }
export let log = logger.child(logMetadata)

export function addLogMetadata({ metadata }) {
  const newLogMetadata = {
    ...logMetadata,
    ...metadata
  }
  log = logger.child(newLogMetadata)
  logMetadata = newLogMetadata
}
