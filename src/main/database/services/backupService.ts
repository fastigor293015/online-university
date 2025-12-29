import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import fs from 'fs-extra'
import path from 'path'
import { Pool, Client } from 'pg'
import { dialog } from 'electron'
import { BackupObject, PostgreSQLTools } from '@common/types/database'

const execAsync = promisify(exec)

export interface BackupOptions {
  format: 'sql' | 'custom' | 'directory' | 'tar'
  schemaOnly?: boolean
  dataOnly?: boolean
  compress?: boolean
  tables?: string[]
  excludeTables?: string[]
}

export interface RestoreOptions {
  clean?: boolean
  create?: boolean
}

export class BackupService {
  private static connectionConfig = {
    host: 'localhost',
    port: 5432,
    database: 'online_university',
    user: 'postgres',
    password: 'Rq489qq2cxc@'
  }

  /**
   * Создание резервной копии с использованием pg_dump
   */
  static async createBackup(options: BackupOptions = { format: 'custom' }): Promise<BackupObject> {
    try {
      // Показываем диалог сохранения файла
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const defaultFileName = `backup_online_university_${timestamp}.${this.getFileExtension(options)}`

      const { filePath } = await dialog.showSaveDialog({
        title: 'Сохранить резервную копию',
        defaultPath: path.join(process.cwd(), defaultFileName),
        filters: [
          { name: 'SQL Files', extensions: ['sql'] },
          { name: 'Custom Format', extensions: ['backup'] },
          { name: 'Tar Files', extensions: ['tar'] },
          { name: 'Compressed', extensions: ['gz'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (!filePath) {
        return { success: false, error: 'Операция отменена пользователем' }
      }

      // Подготавливаем команду pg_dump
      const args = this.buildPgDumpArgs(options, filePath)

      // Выполняем команду
      await this.executeCommand('pg_dump', args)

      return { success: true, filePath }
    } catch (error: any) {
      console.error('Backup error:', error)
      return {
        success: false,
        error: this.parseError(error)
      }
    }
  }

  /**
   * Восстановление из резервной копии
   */
  static async restoreBackup(
    filePath: string,
    options: RestoreOptions = {}
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!(await fs.pathExists(filePath))) {
        return { success: false, error: 'Файл не найден' }
      }

      // Определяем формат файла и выбираем команду восстановления
      const extension = path.extname(filePath).toLowerCase()
      let command: string
      let args: string[]

      if (extension === '.sql') {
        command = 'psql'
        args = this.buildPsqlArgs(options, filePath)
      } else {
        command = 'pg_restore'
        args = this.buildPgRestoreArgs(options, filePath)
      }

      // Выполняем команду
      await this.executeCommand(command, args)

      return {
        success: true,
        message: 'База данных успешно восстановлена из резервной копии'
      }
    } catch (error: any) {
      console.error('Restore error:', error)
      return {
        success: false,
        error: this.parseError(error)
      }
    }
  }

  /**
   * Экспорт данных в JSON (альтернатива SQL дампу)
   */
  static async exportToJSON(
    filePath: string
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const pool = new Pool(this.connectionConfig)

      // Получаем список всех таблиц
      const tablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `

      const tablesResult = await pool.query(tablesQuery)
      const tables = tablesResult.rows.map((row) => row.table_name)

      // Собираем данные из всех таблиц
      const backupData: any = {
        metadata: {
          database: 'online_university',
          version: '1.0',
          createdAt: new Date().toISOString(),
          tablesCount: tables.length
        },
        data: {}
      }

      for (const table of tables) {
        const data = await pool.query(`SELECT * FROM ${table}`)
        backupData.data[table] = data.rows
      }

      await pool.end()
      await fs.writeJSON(filePath, backupData, { spaces: 2 })

      return { success: true, filePath }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Импорт данных из JSON
   */
  static async importFromJSON(
    filePath: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!(await fs.pathExists(filePath))) {
        return { success: false, error: 'Файл не найден' }
      }

      const backupData = await fs.readJSON(filePath)
      const pool = new Pool(this.connectionConfig)

      // Начинаем транзакцию
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        for (const [tableName, rows] of Object.entries(backupData.data)) {
          if (Array.isArray(rows) && rows.length > 0) {
            // Получаем названия колонок
            const columns = Object.keys(rows[0])

            // Создаем временную таблицу для данных
            const tempTable = `temp_${tableName}_${Date.now()}`
            await client.query(
              `CREATE TEMP TABLE ${tempTable} AS SELECT * FROM ${tableName} LIMIT 0`
            )

            // Вставляем данные во временную таблицу
            for (const row of rows as any[]) {
              const columnNames = columns.join(', ')
              const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ')
              const values = columns.map((col) => row[col])

              await client.query(
                `INSERT INTO ${tempTable} (${columnNames}) VALUES (${valuePlaceholders})`,
                values
              )
            }

            // Копируем данные из временной таблицы в основную
            await client.query(`
              INSERT INTO ${tableName} (${columns.join(', ')})
              SELECT ${columns.join(', ')} FROM ${tempTable}
              ON CONFLICT DO NOTHING
            `)

            await client.query(`DROP TABLE ${tempTable}`)
          }
        }

        await client.query('COMMIT')

        return {
          success: true,
          message: `Импортировано данных из ${Object.keys(backupData.data).length} таблиц`
        }
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
        await pool.end()
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Быстрое резервное копирование с минимальными настройками
   */
  static async quickBackup(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    return this.createBackup({
      format: 'custom',
      compress: true
    })
  }

  /**
   * Получение информации о базе данных
   */
  static async getDatabaseInfo(): Promise<{
    name: string
    size: string
    tablesCount: number
    totalRows: number
    lastBackup?: string
  }> {
    try {
      const pool = new Pool(this.connectionConfig)

      // Размер базы данных
      const sizeResult = await pool.query(`
        SELECT pg_size_pretty(pg_database_size('online_university')) as size
      `)

      // Количество таблиц
      const tablesResult = await pool.query(`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      `)

      // Общее количество записей во всех таблицах
      const tablesQuery = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      `)

      let totalRows = 0
      for (const table of tablesQuery.rows) {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table.table_name}`)
        totalRows += parseInt(countResult.rows[0].count)
      }

      await pool.end()

      return {
        name: 'online_university',
        size: sizeResult.rows[0].size,
        tablesCount: parseInt(tablesResult.rows[0].count),
        totalRows
      }
    } catch (error) {
      console.error('Error getting database info:', error)
      throw error
    }
  }

  /**
   * Проверка доступности утилит PostgreSQL
   */
  static async checkPostgreSQLTools(): Promise<PostgreSQLTools> {
    try {
      await execAsync('pg_dump --version')
      await execAsync('pg_restore --version')
      await execAsync('psql --version')

      return {
        pg_dump: true,
        pg_restore: true,
        psql: true
      }
    } catch (error) {
      return {
        pg_dump: false,
        pg_restore: false,
        psql: false
      }
    }
  }

  // ========== Вспомогательные методы ==========

  private static buildPgDumpArgs(options: BackupOptions, filePath: string): string[] {
    const args = [
      '-h',
      this.connectionConfig.host,
      '-p',
      this.connectionConfig.port.toString(),
      '-U',
      this.connectionConfig.user,
      '-d',
      this.connectionConfig.database,
      '-f',
      filePath,
      '-F',
      this.getFormatChar(options.format)
    ]

    if (options.schemaOnly) args.push('--schema-only')
    if (options.dataOnly) args.push('--data-only')
    if (options.compress) args.push('--compress=9')

    // Включаем конкретные таблицы
    if (options.tables && options.tables.length > 0) {
      args.push('-t', options.tables.join(' -t '))
    }

    // Исключаем таблицы
    if (options.excludeTables && options.excludeTables.length > 0) {
      args.push('-T', options.excludeTables.join(' -T '))
    }

    args.push('--verbose')
    return args
  }

  private static buildPgRestoreArgs(options: RestoreOptions, filePath: string): string[] {
    const args = [
      '-h',
      this.connectionConfig.host,
      '-p',
      this.connectionConfig.port.toString(),
      '-U',
      this.connectionConfig.user,
      '-d',
      this.connectionConfig.database,
      filePath
    ]

    if (options.clean) args.push('--clean')
    if (options.create) args.push('--create')

    args.push('--verbose')
    return args
  }

  private static buildPsqlArgs(options: RestoreOptions, filePath: string): string[] {
    const args = [
      '-h',
      this.connectionConfig.host,
      '-p',
      this.connectionConfig.port.toString(),
      '-U',
      this.connectionConfig.user,
      '-d',
      this.connectionConfig.database,
      '-f',
      filePath
    ]

    if (options.clean) args.push('--set', 'ON_ERROR_STOP=1')

    args.push('--echo-all')
    return args
  }

  private static async executeCommand(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const env = {
        ...process.env,
        PGPASSWORD: this.connectionConfig.password
      }

      const proc = spawn(command, args, { env })

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      proc.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Command failed: ${stderr || `Exit code ${code}`}`))
        }
      })

      proc.on('error', (error) => {
        reject(error)
      })
    })
  }

  private static getFormatChar(format: BackupOptions['format']): string {
    const map: Record<string, string> = {
      sql: 'p',
      custom: 'c',
      directory: 'd',
      tar: 't'
    }
    return map[format] || 'c'
  }

  private static getFileExtension(options: BackupOptions): string {
    switch (options.format) {
      case 'sql':
        return 'sql'
      case 'custom':
        return 'backup'
      case 'directory':
        return 'dir'
      case 'tar':
        return 'tar'
      default:
        return 'sql'
    }
  }

  private static parseError(error: any): string {
    if (error.message.includes('ENOENT')) {
      return 'Утилиты PostgreSQL не найдены. Убедитесь, что PostgreSQL установлен и pg_dump доступен в PATH.'
    }

    if (error.message.includes('password authentication failed')) {
      return 'Ошибка аутентификации. Проверьте логин и пароль PostgreSQL.'
    }

    if (error.message.includes('could not connect')) {
      return 'Не удалось подключиться к PostgreSQL. Убедитесь, что сервер запущен.'
    }

    return error.message || 'Неизвестная ошибка'
  }
}
