/**
 * Optimizes a Cloudinary URL with transformations
 */
export function getOptimizedImage(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'avif'
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options


  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return url

  const baseUrl = url.slice(0, uploadIndex + 8) // include '/upload/'
  const restUrl = url.slice(uploadIndex + 8)

  const transformations = [
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    crop ? `c_${crop}` : '',
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(',')

  return `${baseUrl}${transformations}/${restUrl}`
}

/**
 * Generates srcset for responsive images
 */
export function getSrcSet(
  url: string,
  widths: number[] = [640, 768, 1024, 1280, 1536],
  options: Omit<Parameters<typeof getOptimizedImage>[1], 'width'> = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return ''
  }

  return widths
    .map((w) => {
      const optimizedUrl = getOptimizedImage(url, { ...options, width: w })
      return `${optimizedUrl} ${w}w`
    })
    .join(', ')
}
