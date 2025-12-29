export const validationRules = {
  required: (message = 'Это поле обязательно для заполнения') => ({
    required: true,
    message
  }),

  email: (message = 'Введите корректный email адрес') => ({
    type: 'email' as const,
    message
  }),

  min: (min: number, message?: string) => ({
    min,
    message: message || `Минимальное значение: ${min}`
  }),

  max: (max: number, message?: string) => ({
    max,
    message: message || `Максимальное значение: ${max}`
  }),

  minLength: (min: number, message?: string) => ({
    min,
    message: message || `Минимальная длина: ${min} символов`
  }),

  maxLength: (max: number, message?: string) => ({
    max,
    message: message || `Максимальная длина: ${max} символов`
  }),

  pattern: (pattern: RegExp, message: string) => ({
    pattern,
    message
  }),

  phone: (message = 'Введите корректный номер телефона') => ({
    pattern: /^\+?[1-9]\d{1,14}$/,
    message
  }),

  url: (message = 'Введите корректный URL') => ({
    type: 'url' as const,
    message
  }),

  positiveNumber: (message = 'Число должно быть положительным') => ({
    validator: (_: any, value: number) => {
      if (!value || value > 0) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    }
  }),

  futureDate: (message = 'Дата должна быть в будущем') => ({
    validator: (_: any, value: Date) => {
      if (!value || new Date(value) > new Date()) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    }
  }),

  pastDate: (message = 'Дата должна быть в прошлом') => ({
    validator: (_: any, value: Date) => {
      if (!value || new Date(value) < new Date()) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    }
  })
}

// Специализированные валидаторы для нашего приложения
export const universityValidators = {
  uniTitle: [
    validationRules.required('Введите название университета'),
    validationRules.maxLength(100, 'Название не должно превышать 100 символов')
  ],

  uniAddress: [validationRules.maxLength(100, 'Адрес не должен превышать 100 символов')],

  uniSite: [
    validationRules.url('Введите корректный URL'),
    validationRules.maxLength(100, 'URL не должен превышать 100 символов')
  ]
}

export const teacherValidators = {
  name: [
    validationRules.required('Введите ФИО преподавателя'),
    validationRules.maxLength(100, 'ФИО не должно превышать 100 символов')
  ],

  universityId: [validationRules.required('Выберите университет')],

  info: [validationRules.maxLength(2000, 'Информация не должна превышать 2000 символов')]
}

export const studentValidators = {
  studentName: [
    validationRules.required('Введите имя студента'),
    validationRules.maxLength(100, 'Имя не должно превышать 100 символов')
  ],

  email: [
    validationRules.required('Введите email адрес'),
    validationRules.email(),
    validationRules.maxLength(100, 'Email не должен превышать 100 символов')
  ],

  education: [validationRules.maxLength(100, 'Образование не должно превышать 100 символов')],

  work: [validationRules.maxLength(100, 'Место работы не должно превышать 100 символов')]
}

export const courseValidators = {
  title: [
    validationRules.required('Введите название курса'),
    validationRules.maxLength(100, 'Название не должно превышать 100 символов')
  ],

  teacherId: [validationRules.required('Выберите преподавателя')],

  universityId: [validationRules.required('Выберите университет')],

  startDate: [
    validationRules.required('Выберите дату начала'),
    validationRules.futureDate('Дата начала должна быть в будущем')
  ],

  price: [
    validationRules.required('Введите цену'),
    validationRules.min(0, 'Цена не может быть отрицательной')
  ],

  categoryId: [validationRules.required('Выберите категорию')],

  formatId: [validationRules.required('Выберите формат')],

  length: [validationRules.min(1, 'Длительность должна быть не менее 1 дня')],

  participants: [validationRules.min(0, 'Количество участников не может быть отрицательным')]
}

// Валидация форм
export const validateForm = (values: any, rules: any): Record<string, string[]> => {
  const errors: Record<string, string[]> = {}

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field]
    const value = values[field]

    for (const rule of fieldRules) {
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field] = errors[field] || []
        errors[field].push(rule.message || 'Это поле обязательно')
        break
      }

      if (rule.type === 'email' && value) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i
        if (!emailRegex.test(value)) {
          errors[field] = errors[field] || []
          errors[field].push(rule.message || 'Введите корректный email')
        }
      }

      if (rule.type === 'url' && value) {
        try {
          new URL(value)
        } catch {
          errors[field] = errors[field] || []
          errors[field].push(rule.message || 'Введите корректный URL')
        }
      }

      if (rule.min !== undefined && value !== undefined && value < rule.min) {
        errors[field] = errors[field] || []
        errors[field].push(rule.message || `Минимальное значение: ${rule.min}`)
      }

      if (rule.max !== undefined && value !== undefined && value > rule.max) {
        errors[field] = errors[field] || []
        errors[field].push(rule.message || `Максимальное значение: ${rule.max}`)
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors[field] = errors[field] || []
        errors[field].push(rule.message || 'Неверный формат')
      }
    }
  })

  return errors
}
