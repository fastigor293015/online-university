import { useCallback, useEffect, useRef } from 'react'
import { IpcChannels } from '../../common/ipc/types'

export const useIpc = () => {
  const listeners = useRef<Map<string, Function[]>>(new Map())

  const invoke = useCallback(async <T = any>(channel: string, ...args: any[]): Promise<T> => {
    if (!window.electronAPI) {
      throw new Error('Electron API is not available')
    }
    return window.electronAPI.invoke<T>(channel, ...args)
  }, [])

  const on = useCallback((channel: string, callback: (...args: any[]) => void) => {
    if (!window.electronAPI) return () => {}

    const cleanup = window.electronAPI.on(channel, callback)

    // Store for cleanup on unmount
    if (!listeners.current.has(channel)) {
      listeners.current.set(channel, [])
    }
    listeners.current.get(channel)?.push(cleanup)

    return cleanup
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      listeners.current.forEach((cleanups, channel) => {
        cleanups.forEach((cleanup) => cleanup())
      })
      listeners.current.clear()
    }
  }, [])

  return {
    invoke,
    on,
    course: {
      findAll: (filters?: any) => invoke(IpcChannels.COURSE_FIND_ALL, filters),
      findById: (id: number) => invoke(IpcChannels.COURSE_FIND_BY_ID, id),
      create: (data: any) => invoke(IpcChannels.COURSE_CREATE, data),
      update: (id: number, data: any) => invoke(IpcChannels.COURSE_UPDATE, id, data),
      delete: (id: number) => invoke(IpcChannels.COURSE_DELETE, id)
    },
    student: {
      findAll: (filters?: any) => invoke(IpcChannels.STUDENT_FIND_ALL, filters),
      findById: (id: number) => invoke(IpcChannels.STUDENT_FIND_BY_ID, id),
      create: (data: any) => invoke(IpcChannels.STUDENT_CREATE, data),
      update: (id: number, data: any) => invoke(IpcChannels.STUDENT_UPDATE, id, data),
      delete: (id: number) => invoke(IpcChannels.STUDENT_DELETE, id)
    }
  }
}
