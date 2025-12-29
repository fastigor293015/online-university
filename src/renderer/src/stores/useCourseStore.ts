import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useIpc } from '../hooks/useIpc'
import { Course,  } from '@common/types/database'

interface CourseQueryState {
  data: Course[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

interface CourseMutationState {
  isMutating: boolean
  error: string | null
}

interface CourseStore {
  // Query states
  queries: Record<string, CourseQueryState>

  // Mutation states
  mutations: Record<string, CourseMutationState>

  // Actions
  setFilters: (key: string, filters: CourseFilters) => void
  setPagination: (key: string, pagination: Partial<CourseQueryState['pagination']>) => void

  // Query methods
  fetchCourses: (key: string, filters?: CourseFilters) => Promise<void>
  fetchCourseById: (id: number) => Promise<Course | null>

  // Mutation methods
  createCourse: (data: any) => Promise<Course | null>
  updateCourse: (id: number, data: any) => Promise<Course | null>
  deleteCourse: (id: number) => Promise<boolean>

  // Utilities
  resetQuery: (key: string) => void
  resetMutation: (key: string) => void
}

const initialQueryState: CourseQueryState = {
  data: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

const initialMutationState: CourseMutationState = {
  isMutating: false,
  error: null
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set, get) => {
      const { course } = useIpc()

      return {
        queries: {},
        mutations: {},

        setFilters: (key, filters) => {
          set((state) => ({
            queries: {
              ...state.queries,
              [key]: {
                ...state.queries[key],
                filters: { ...state.queries[key]?.filters, ...filters }
              }
            }
          }))
        },

        setPagination: (key, pagination) => {
          set((state) => ({
            queries: {
              ...state.queries,
              [key]: {
                ...state.queries[key],
                pagination: { ...state.queries[key]?.pagination, ...pagination }
              }
            }
          }))
        },

        fetchCourses: async (key, filters = {}) => {
          // Инициализация состояния запроса
          if (!get().queries[key]) {
            set((state) => ({
              queries: {
                ...state.queries,
                [key]: initialQueryState
              }
            }))
          }

          // Устанавливаем состояние загрузки
          set((state) => ({
            queries: {
              ...state.queries,
              [key]: {
                ...state.queries[key],
                isLoading: true,
                error: null
              }
            }
          }))

          try {
            const queryFilters = {
              ...get().queries[key]?.filters,
              ...filters,
              limit: get().queries[key]?.pagination.pageSize,
              offset:
                (get().queries[key]?.pagination.page - 1) * get().queries[key]?.pagination.pageSize
            }

            const response = await course.findAll(queryFilters)

            if (response.success) {
              set((state) => ({
                queries: {
                  ...state.queries,
                  [key]: {
                    ...state.queries[key],
                    data: response.data || [],
                    isLoading: false,
                    pagination: {
                      ...state.queries[key].pagination,
                      total: response.total || response.data?.length || 0
                    }
                  }
                }
              }))
            } else {
              throw new Error(response.error || 'Failed to fetch courses')
            }
          } catch (error: any) {
            set((state) => ({
              queries: {
                ...state.queries,
                [key]: {
                  ...state.queries[key],
                  isLoading: false,
                  error: error.message
                }
              }
            }))
          }
        },

        fetchCourseById: async (id) => {
          try {
            const response = await course.findById(id)
            return response.success ? response.data : null
          } catch (error) {
            console.error('Failed to fetch course:', error)
            return null
          }
        },

        createCourse: async (data) => {
          const mutationKey = 'createCourse'

          set((state) => ({
            mutations: {
              ...state.mutations,
              [mutationKey]: {
                isMutating: true,
                error: null
              }
            }
          }))

          try {
            const response = await course.create(data)

            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: response.success ? null : response.error
                }
              }
            }))

            return response.success ? response.data : null
          } catch (error: any) {
            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: error.message
                }
              }
            }))
            return null
          }
        },

        updateCourse: async (id, data) => {
          const mutationKey = `updateCourse_${id}`

          set((state) => ({
            mutations: {
              ...state.mutations,
              [mutationKey]: {
                isMutating: true,
                error: null
              }
            }
          }))

          try {
            const response = await course.update(id, data)

            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: response.success ? null : response.error
                }
              }
            }))

            return response.success ? response.data : null
          } catch (error: any) {
            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: error.message
                }
              }
            }))
            return null
          }
        },

        deleteCourse: async (id) => {
          const mutationKey = `deleteCourse_${id}`

          set((state) => ({
            mutations: {
              ...state.mutations,
              [mutationKey]: {
                isMutating: true,
                error: null
              }
            }
          }))

          try {
            const response = await course.delete(id)

            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: response.success ? null : response.error
                }
              }
            }))

            return response.success
          } catch (error: any) {
            set((state) => ({
              mutations: {
                ...state.mutations,
                [mutationKey]: {
                  isMutating: false,
                  error: error.message
                }
              }
            }))
            return false
          }
        },

        resetQuery: (key) => {
          set((state) => ({
            queries: {
              ...state.queries,
              [key]: initialQueryState
            }
          }))
        },

        resetMutation: (key) => {
          set((state) => ({
            mutations: {
              ...state.mutations,
              [key]: initialMutationState
            }
          }))
        }
      }
    },
    {
      name: 'course-store'
    }
  )
)
