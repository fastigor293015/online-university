import { electronAPI } from './'

declare global {
  interface Window {
    electronAPI: typeof electronAPI
  }
}
