import bcrypt from 'bcrypt'
import { AuthData, AuthResponse } from '@common/types/database'
import { User } from '../models'

export class UserService {
  static async register(data: AuthData): Promise<AuthResponse> {
    const { username, password } = data

    const existingUser = await User.findOne({
      where: {
        username
      },
      raw: true
    })

    if (existingUser) {
      return {
        success: false,
        message: 'Пользователь с таким логином уже существует'
      }
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const createdUser = await User.create({
      username,
      password_hash: passwordHash
    })

    return {
      success: true,
      message: 'Регистрация успешна',
      user: createdUser
    }
  }

  static async login(data: AuthData): Promise<AuthResponse> {
    const { username, password } = data

    const user = await User.findOne({
      where: {
        username
      },
      raw: true
    })

    if (!user) {
      return {
        success: false,
        message: 'Неверное имя пользователя или пароль'
      }
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return {
        success: false,
        message: 'Неверное имя пользователя или пароль'
      }
    }

    // Обновляем последний вход
    // await user.update({ last_login: new Date() })
    // user.save()

    return {
      success: true,
      message: 'Вход выполнен успешно',
      user
    }
  }
}
