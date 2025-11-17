import { useState, useEffect } from 'react'
import type { FC } from 'react'

interface Image {
  id: string
  url: string
  alt: string
}

interface HeroGalleryProps {
  images: Image[]
}

export const HeroGallery: FC<HeroGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play carousel - solo automático
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Imágenes */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-center "
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Overlay oscuro para mejorar legibilidad del texto */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>
    </div>
  )
}
