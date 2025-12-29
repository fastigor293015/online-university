import { sequelizeLogger } from '@main/utils/logger'
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'online_university',
  username: 'postgres',
  password: 'Rq489qq2cxc@',
  host: 'localhost',
  port: 5432,
  logging: process.env.NODE_ENV === 'development' ? sequelizeLogger : false,
  dialectOptions: {
    charset: 'utf8'
  }
})

// export const sequelize = new Sequelize({
//   dialect: (process.env.DB_DIALECT || 'postgres') as Dialect,
//   database: process.env.DB_NAME || 'database',
//   username: process.env.DB_USER || 'user',
//   password: process.env.DB_PASSWORD || 'password',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   logging: process.env.NODE_ENV === 'development' ? sequelizeLogger : false
// })
