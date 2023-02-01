import { createLogger, transports, format } from 'winston'
import moment from 'moment'

const today = new Date()
const dateFormated: string = moment(today).format('YYYY-MM-DD')
const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp, ...args }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message} ${JSON.stringify(args)}`
})

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `backup-${dateFormated}.log` })
  ]
})

export default logger
