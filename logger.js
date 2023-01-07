const winston = require('winston');
const { transports, format } = require('winston');

const log = winston.createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        format.printf(info => `${[info.timestamp]} : ${info.level} : ${info.message}`))
    }),
    new transports.File({
      filename: 'logs.txt',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        format.printf(info => `${[info.timestamp]} : ${info.level} : ${info.message}`)
      )
    }),
    new transports.File({
      filename: 'logs.txt',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        format.printf(error => `${[error.timestamp]} : ${error.level} : ${error.message}`)
      )
    })]
});
module.exports.log = log;
