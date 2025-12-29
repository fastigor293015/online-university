export const getTimestamp = (): string =>
  new Date().toISOString().replace('T', ' ').replace('Z', '')
