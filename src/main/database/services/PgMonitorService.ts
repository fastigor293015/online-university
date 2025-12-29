import { logger } from '@main/utils/logger'

import { Pool, PoolConfig } from 'pg'
import EventEmitter from 'events'
import { PGMetrics } from '@common/types/database'

export class PostgresMonitorService extends EventEmitter {
  pool: Pool
  metrics: Partial<PGMetrics>
  isMonitoring: boolean
  interval: NodeJS.Timeout | null

  constructor(config: PoolConfig) {
    super()
    this.pool = new Pool(config)
    this.metrics = {}
    this.isMonitoring = false
    this.interval = null
  }

  async startMonitoring(intervalSec = 5) {
    this.isMonitoring = true
    this.interval = setInterval(() => this.collectMetrics(), intervalSec * 1000)
    // Сразу собираем первую метрику
    await this.collectMetrics()
  }

  stopMonitoring() {
    this.isMonitoring = false
    if (this.interval) clearInterval(this.interval)
  }

  async collectMetrics() {
    try {
      const client = await this.pool.connect()
      const newMetrics = {}

      // 1. Основные метрики активности
      const activityRes = await client.query(`
                SELECT
                    (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
                    (SELECT count(*) FROM pg_stat_activity WHERE wait_event_type IS NOT NULL) as waiting_connections,
                    (SELECT count(*) FROM pg_locks WHERE granted = false) as blocked_transactions
            `)
      Object.assign(newMetrics, activityRes.rows[0])

      // 2. Производительность и транзакции
      const perfRes = await client.query(`
                SELECT
                    xact_commit,
                    xact_rollback,
                    blks_read,
                    blks_hit,
                    (blks_hit * 100.0 / (blks_hit + blks_read + 1)) as cache_hit_ratio
                FROM pg_stat_database
                WHERE datname = current_database()
            `)
      Object.assign(newMetrics, perfRes.rows[0])

      // 3. Размеры баз данных и таблиц
      const sizeRes = await client.query(`
                SELECT
                    pg_size_pretty(pg_database_size(current_database())) as db_size,
                    (SELECT COUNT(*) FROM pg_stat_user_tables) as table_count
            `)
      Object.assign(newMetrics, sizeRes.rows[0])

      client.release()

      // Сохраняем и уведомляем подписчиков
      this.metrics = newMetrics
      this.metrics.timestamp = new Date()
      this.metrics.status = 'healthy'
      this.emit('metrics-updated', this.metrics)
    } catch (error) {
      logger.error('Failed to initialize database:', error)
    }
  }

  getLastMetrics() {
    return this.metrics
  }
}
