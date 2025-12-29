import { sequelize } from './config'
import { logger, sequelizeLogger } from '../utils/logger'
import { initAssociations } from './associations'
import { SyncOptions } from 'sequelize'

/**
 * Инициализация базы данных
 * 1. Подключается к PostgreSQL
 * 2. Создает таблицы если их нет (sync)
 * 3. Устанавливает связи между таблицами
 * 4. Заполняет базовые данные
 */
export async function initDatabase(): Promise<void> {
  try {
    logger.info('Initializing database connection...')

    // 1. Аутентификация подключения
    await sequelize.authenticate()
    logger.info('Database connection has been established successfully.')

    // 2. Синхронизация моделей (создание/обновление таблиц)
    // В development режиме используем alter: true для обновления схемы
    // В production используем миграции вместо sync
    const syncOptions: SyncOptions =
      process.env.NODE_ENV === 'development' ? { logging: sequelizeLogger } : { logging: false }

    await sequelize.sync(syncOptions)
    logger.info('Database models synchronized successfully.')

    // 3. Установка связей между моделями
    initAssociations()
    logger.info('Database associations initialized.')
  } catch (error) {
    logger.error('Failed to initialize database:', error)
    throw error
  }
}

/**
 * Закрытие подключения к базе данных
 */
export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close()
    logger.info('Database connection closed.')
  } catch (error) {
    logger.error('Error closing database connection:', error)
    throw error
  }
}

/**
 * Проверка состояния подключения к БД
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sequelize.authenticate()
    return true
  } catch (error) {
    logger.error('Database health check failed:', error)
    return false
  }
}

export default sequelize
