import { useState, useMemo, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface PortfolioImage {
  id: string;
  image_url: string;
  thumbnail_url: string | null;
  title: string | null;
  alt: string | null;
  category_id: string | null;
  category: Category | null;
  is_featured: boolean;
  order: number;
}

interface PortfolioGridProps {
  images: PortfolioImage[];
  categories: Category[];
}

export default function PortfolioGrid({ images, categories }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Filtrar imágenes por categoría
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return images;
    }
    return images.filter(img => img.category_id === selectedCategory);
  }, [images, selectedCategory]);

  // Formatear nombre de categoría para mostrar
  const formatCategory = (categoryId: string): string => {
    if (categoryId === 'all') return 'TODAS';
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name.toUpperCase() : categoryId.toUpperCase();
  };

  // Abrir modal con imagen seleccionada
  const openModal = (image: PortfolioImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Navegar a imagen anterior
  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Navegar a imagen siguiente
  const goToNext = () => {
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Manejar teclas de navegación
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, filteredImages]);

  return (
    <div className="w-full">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {/* Botón TODAS */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`
            px-5 py-2 rounded-full text-xs font-semibold hover:cursor-pointer hover:scale-105 tracking-wider transition-all duration-300
            ${selectedCategory === 'all'
              ? 'bg-black/95 dark:bg-white/95 text-white dark:text-black'
              : 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            }
          `}
        >
          TODAS
        </button>

        {/* Botones de categorías */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-5 py-2 rounded-full text-xs font-semibold tracking-wider hover:cursor-pointer hover:scale-105 transition-all duration-300
              ${selectedCategory === category.id
                ? 'bg-black/95 dark:bg-white/98 text-white dark:text-black'
                : 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
              }
            `}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid de imágenes */}
      {filteredImages.length > 0 ? (
        <div
          className={`
            grid gap-4 auto-rows-[300px]
            ${filteredImages.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : filteredImages.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : filteredImages.length === 3
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }
          `}
        >
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openModal(image, index)}
              className={`
                group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
                ${filteredImages.length === 1
                  ? 'row-span-2'
                  : index === 0 && filteredImages.length >= 6
                    ? 'col-span-2 row-span-2'
                    : ''
                }
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Imagen */}
              <img
                src={image.thumbnail_url || image.image_url}
                alt={image.alt || image.title || 'Portfolio image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay con información */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  {image.title && (
                    <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                      {image.title}
                    </h3>
                  )}
                  {image.category && (
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md rounded-md text-black text-[10px] font-bold tracking-widest">
                      {image.category.name.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay imágenes en esta categoría
          </p>
        </div>
      )}

      {/* Contador de imágenes */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-bold text-black dark:text-white">{filteredImages.length}</span> de{' '}
          <span className="font-bold text-black dark:text-white">{images.length}</span> imágenes
        </p>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Botón anterior */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-50 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Botón siguiente */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-50 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Imagen siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Contenedor de imagen */}
          <div
            className="relative max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.alt || selectedImage.title || 'Portfolio image'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* Información de la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              {selectedImage.title && (
                <h3 className="text-white font-bold text-xl mb-2">
                  {selectedImage.title}
                </h3>
              )}
              <div className="flex items-center justify-between">
                {selectedImage.category && (
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md rounded-md text-black text-xs font-bold tracking-widest">
                    {selectedImage.category.name.toUpperCase()}
                  </span>
                )}
                {filteredImages.length > 1 && (
                  <span className="text-white text-sm">
                    {currentIndex + 1} / {filteredImages.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
