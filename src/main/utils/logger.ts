import winston from 'winston'
import path from 'path'
import fs from 'fs'
import { Options } from 'sequelize'

// Создаем директорию для логов если её нет
const logDir = path.join(
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../logs')
    : path.join(process.resourcesPath, 'logs')
)

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Конфигурация логгера
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'online-university-admin' },
  transports: [
    // Запись в файл ошибок
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Запись всех логов в общий файл
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
})

// В development режиме также выводим логи в консоль
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  )
}

export const sequelizeLogger: Options['logging'] = (sql: string, timing?: number) => {
  // Приводим timing к числу, если оно есть (Sequelize иногда передает его как строку)
  const execTime = timing ? Number(timing) : undefined

  // Логируем с разными уровнями в зависимости от типа запроса
  const sqlLower = sql.toLowerCase()

  if (sqlLower.includes('error') || sqlLower.includes('fail')) {
    logger.error('Sequelize Error', { sql, timing: execTime })
  } else if (sqlLower.includes('select')) {
    logger.debug('Sequelize SELECT', { sql, timing: execTime })
  } else if (sqlLower.includes('insert') || sqlLower.includes('update')) {
    logger.info('Sequelize WRITE', { sql, timing: execTime })
  } else {
    logger.verbose('Sequelize Query', { sql, timing: execTime })
  }
}

/**
 * Простой и надежный логгер для main процесса
 * Не использует сложные зависимости вроде winston
 */

// type LogLevel = 'info' | 'error' | 'warn' | 'debug'

// export class Logger {
//   static formatMessage(level: LogLevel, message: string): string {
//     const timestamp = new Date().toISOString()
//     return `[${level.toUpperCase()}] ${timestamp} ${message}`
//   }

//   static info(message: string, ...args: any[]): void {
//     console.log(Logger.formatMessage('info', message), ...args)
//   }

//   static error(message: string, error?: any): void {
//     if (error) {
//       console.error(Logger.formatMessage('error', message), error)
//     } else {
//       console.error(Logger.formatMessage('error', message))
//     }
//   }

//   static warn(message: string, ...args: any[]): void {
//     console.warn(Logger.formatMessage('warn', message), ...args)
//   }

//   static debug(message: string, ...args: any[]): void {
//     if (process.env.NODE_ENV === 'development') {
//       console.debug(Logger.formatMessage('debug', message), ...args)
//     }
//   }
// }
