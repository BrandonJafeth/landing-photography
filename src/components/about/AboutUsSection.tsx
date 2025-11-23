import { useState } from 'react';

export default function AboutUsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-16 md:py-24 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagen */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start px-4">
            <div className="relative w-full max-w-[350px] sm:max-w-md">
              {/* Stack de fotos tipo Polaroid */}
              <div className="polaroid-stack">
                {/* Foto principal */}
                <div className="polaroid-card">
                  <div className="polaroid-inner">
                    <img
                      src="https://res.cloudinary.com/dxvbifdfb/image/upload/v1763477218/about-us/y7myjgivbto9akxm5jvf.jpg"
                      alt="Joel Gadea - Fotógrafo"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="polaroid-card polaroid-back-2"></div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="order-1 lg:order-2 px-4">
            <div className="space-y-6 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-black dark:text-white uppercase mb-4">
                  SOBRE NOSOTROS
                </p>
                <h2 className="text-lg font-semibold text-[#000000]/75 dark:text-white/80 leading-tight">
                  Cada foto es un reflejo auténtico de tu vida
                </h2>
              </div>

              <div className="space-y-4 text-lg text-[#000000]/70 dark:text-gray-400 leading-relaxed">
                <p>
                  Hola soy{' '}
                  <span className="font-semibold text-[#000000] dark:text-white">
                    Joel Gadea
                  </span>
                  , un fotógrafo profesional con más de 2 años de experiencia
                  capturando momentos únicos y especiales. Mi pasión por la
                  fotografía comenzó cuando descubrí que una imagen puede contar
                  mil historias y preservar emociones para siempre.
                </p>

                {/* Contenido expandible - solo mobile/tablet */}
                <div className="lg:hidden ">
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-4 pt-4">
                      <p>
                        A lo largo de mi carrera, he tenido el privilegio de
                        documentar bodas, celebraciones, eventos corporativos y
                        sesiones de retratos que han dejado una huella imborrable
                        en la vida de mis clientes. Mi enfoque se centra en
                        capturar la esencia genuina de cada momento, sin poses
                        forzadas, solo autenticidad y emoción real.
                      </p>
                      <p>
                        Creo firmemente que cada proyecto es único y merece un
                        tratamiento personalizado. Por eso, trabajo estrechamente
                        con mis clientes para entender su visión y crear imágenes
                        que no solo cumplan, sino que superen sus expectativas.
                      </p>
                    </div>
                  </div>

                  {/* Botón Ver más/Ver menos */}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-white hover:underline transition-all"
                  >
                    {isExpanded ? (
                      <>
                        Ver menos
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Ver más
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Contenido completo - siempre visible en desktop */}
                <div className="hidden lg:block space-y-4">
                  <p>
                    A lo largo de mi carrera, he tenido el privilegio de
                    documentar bodas, celebraciones, eventos corporativos y
                    sesiones de retratos que han dejado una huella imborrable en
                    la vida de mis clientes. Mi enfoque se centra en capturar la
                    esencia genuina de cada momento, sin poses forzadas, solo
                    autenticidad y emoción real.
                  </p>
                  <p>
                    Creo firmemente que cada proyecto es único y merece un
                    tratamiento personalizado. Por eso, trabajo estrechamente con
                    mis clientes para entender su visión y crear imágenes que no
                    solo cumplan, sino que superen sus expectativas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Estilos CSS en el mismo archivo (se pueden mover a un archivo CSS global si prefieres)
const styles = `
  .polaroid-stack {
    position: relative;
    width: 100%;
    margin: 0 auto;
  }

  .polaroid-card {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    background: #fff;
    border: 4px solid #000;
    box-shadow: 0 5% 15% rgba(0, 0, 0, 0.5);
    transition: transform 0.25s ease;
  }

  .polaroid-inner {
    width: 100%;
    height: 100%;
    padding: 3%;
    padding-bottom: 8%;
    background: #fff;
  }

  .polaroid-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Fotos de fondo apiladas */
  .polaroid-back-1,
  .polaroid-back-2 {
    position: absolute;
    top: 0;
    left: 0;
    background: #e8e8e8;
    pointer-events: none;
  }

  .polaroid-back-1 {
    transform: rotate(-4deg) translateY(-2%);
    z-index: -1;
  }

  .polaroid-back-2 {
    transform: rotate(4deg) translateY(-4%);
    z-index: -2;
  }

  /* Hover effect */
  .polaroid-stack:hover .polaroid-card:first-child {
    transform: rotate(-2deg);
  }

  /* Dark mode */
  .dark .polaroid-card {
    background: #1a1a1a;
    border-color: #fff;
  }

  .dark .polaroid-inner {
    background: #1a1a1a;
  }

  .dark .polaroid-back-1,
  .dark .polaroid-back-2 {
    background: #2a2a2a;
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
