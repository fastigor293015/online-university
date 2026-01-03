import { useUint8ArrayImage } from '@renderer/hooks/useUint8ArrayImage'
import React, { ImgHTMLAttributes, useState, useCallback, useEffect } from 'react'

interface Uint8ArrayImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Массив байтов изображения */
  imageData: Uint8Array | null | undefined
  /** MIME-тип изображения */
  mimeType?: string
  /** Компонент для отображения во время загрузки */
  loadingFallback?: React.ReactNode
  /** Компонент для отображения при ошибке */
  errorFallback?: React.ReactNode
  /** Отображать стандартное изображение-заглушку при ошибке */
  showDefaultOnError?: boolean
}

/**
 * Компонент для отображения изображения из Uint8Array
 */
export const Uint8ArrayImage: React.FC<Uint8ArrayImageProps> = ({
  imageData,
  mimeType = 'image/jpeg',
  loadingFallback,
  errorFallback,
  showDefaultOnError = false,
  onError,
  alt = 'Image from Uint8Array',
  ...imgProps
}) => {
  const imageUrl = useUint8ArrayImage(imageData, mimeType)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setHasError(true)
      onError?.(e)
    },
    [onError]
  )

  useEffect(() => {
    console.log(imageUrl)
  }, [imageUrl])

  // Если нет данных
  if (!imageData || imageData.length === 0) {
    return errorFallback ? (
      <>{errorFallback}</>
    ) : showDefaultOnError ? (
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        No Image
      </div>
    ) : null
  }

  // Если данные есть, но URL еще не создан
  if (!imageUrl && !hasError) {
    return loadingFallback ? <>{loadingFallback}</> : <div>Loading image...</div>
  }

  // Если произошла ошибка
  if (hasError || !imageUrl) {
    return errorFallback ? (
      <>{errorFallback}</>
    ) : showDefaultOnError ? (
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Error
      </div>
    ) : null
  }

  return <img src={imageUrl} alt={alt} onError={handleError} {...imgProps} />
}
