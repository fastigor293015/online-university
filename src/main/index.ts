import { app, BrowserWindow } from 'electron'
import path, { join } from 'path'
import { initDatabase, closeDatabase } from './database'
import { registerIpcHandlers } from './bridge'
import { logger } from './utils/logger'
import icon from '../../resources/icon.png?asset'

// Главное окно приложения
let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development'

/**
 * Создание главного окна приложения
 */
async function createMainWindow(): Promise<void> {
  logger.info('Creating main window...')

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  // Загрузка React приложения
  if (isDev) {
    // В режиме разработки загружаем с Vite dev сервера
    await mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // В production загружаем собранный файл
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // Показать окно когда контент загрузится
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
      logger.info('Main window is ready and shown')
    }
  })

  // Очистка при закрытии окна
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Инициализация приложения
 */
async function initializeApp(): Promise<void> {
  try {
    logger.info('Initializing application...')

    // 1. Инициализация базы данных
    logger.info('Initializing database...')
    await initDatabase()

    // 2. Регистрация IPC обработчиков
    logger.info('Registering IPC handlers...')
    registerIpcHandlers()

    // 3. Создание главного окна
    logger.info('Creating main window...')
    await createMainWindow()

    logger.info('Application initialized successfully')
  } catch (error) {
    logger.error('Failed to initialize application:', error)
    app.quit()
  }
}

/**
 * Корректное завершение работы приложения
 */
async function shutdownApp(): Promise<void> {
  try {
    logger.info('Shutting down application...')

    // Закрываем соединение с базой данных
    await closeDatabase()

    logger.info('Application shutdown completed')
  } catch (error) {
    logger.error('Error during shutdown:', error)
  }
}

// Обработка готовности приложения
app.whenReady().then(() => {
  initializeApp().catch((error) => {
    logger.error('Application startup error:', error)
    app.quit()
  })
})

// Закрытие приложения при закрытии всех окон (кроме macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Создание окна при активации приложения (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

// Обработка выхода из приложения
app.on('before-quit', async () => {
  logger.info('Application is quitting...')
  await shutdownApp()
})

// Обработка непредвиденных завершений
process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal')
  await shutdownApp()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal')
  await shutdownApp()
  process.exit(0)
})

// Обработка ошибок при запуске
app.on('render-process-gone', (event, webContents, details) => {
  logger.error('Render process gone:', details)
})

app.on('child-process-gone', (event, details) => {
  logger.error('Child process gone:', details)
})
