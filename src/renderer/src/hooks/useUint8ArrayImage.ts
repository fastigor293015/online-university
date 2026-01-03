import { useEffect, useState } from 'react'

export const useUint8ArrayImage = (
  uint8Array: Uint8Array | null | undefined,
  mimeType: string = 'image/jpeg'
): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!uint8Array) {
      setUrl(null)
      return
    }

    // Решение проблемы типов TypeScript
    const blob = new Blob(
      // Явное приведение типа для TypeScript
      [uint8Array as unknown as BlobPart],
      { type: mimeType }
    )

    const newUrl = URL.createObjectURL(blob)
    setUrl(newUrl)

    return () => {
      URL.revokeObjectURL(newUrl)
    }
  }, [uint8Array, mimeType])

  return url
}
