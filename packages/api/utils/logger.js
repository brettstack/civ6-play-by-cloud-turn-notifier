import { createLogger, format, transports } from 'winston'

const logger = createLogger({
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

export default logger