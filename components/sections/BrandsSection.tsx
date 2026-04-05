'use client'

export default function BrandsSection() {
  const brands = [
    { name: 'Dahua', logo: '/marcas_originales/dahua-logo-png.png' },
    { name: 'Imou', logo: '/marcas_originales/imou_logo.png' },
    { name: 'Logitech', logo: '/marcas_originales/logitech-logo.png' },
    { name: 'Forza', logo: '/marcas_originales/forza logo.png' },
    { name: 'Tp-Link', logo: '/marcas_originales/TPLINK_Logo_2.png' },
    { name: 'Mercusys', logo: '/marcas_originales/mercusys-logo.png' },
  ]

  const stats = [
    { number: '50+', label: 'Marcas Oficiales' },
    { number: '10,000+', label: 'Productos Vendidos' },
    { number: '5,000+', label: 'Clientes Satisfechos' },
    { number: '99%', label: 'Productos Originales' },
  ]

  // Duplicar marcas para efecto infinito seamless
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands]

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Marcas con buen respaldo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reunimos marcas reconocidas en seguridad, conectividad, energia y accesorios para que compres con mas confianza.
          </p>
        </div>

        {/* Infinite Carousel for Brands */}
        <div className="mb-16 relative">
          <div className="brands-carousel-container">
            <div className="brands-carousel-track">
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="brands-carousel-item flex items-center justify-center p-4 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group cursor-pointer"
                  title={brand.name}
                >
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={brand.logo || '/placeholder.svg'}
                      alt={brand.name}
                      className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats: Marca del Mes y Novedad de Marca */}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] px-4 py-3 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Marca del Mes */}
            <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 shadow-sm min-h-[80px] w-full">
              <span className="mr-3 inline-block flex-shrink-0 rounded bg-white/90 px-2 py-1 text-xs font-bold text-[hsl(var(--brand-strong))]">
                Marca del Mes
              </span>
              <img
                src="/marcas_originales/imou_logo.png"
                alt="Imou"
                className="w-12 h-12 object-contain rounded bg-white mr-3 flex-shrink-0"
              />
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <span className="font-semibold text-white text-sm leading-tight">
                  Imou
                </span>
                <span className="text-sky-100 text-xs leading-tight">
                  Una marca muy consultada para camaras WiFi y monitoreo practico en casa, negocio o bodega.
                </span>
              </div>
            </div>

            {/* Novedad de Marca */}
            <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 shadow-sm min-h-[80px] w-full">
              <span className="mr-3 inline-block flex-shrink-0 rounded bg-[hsl(var(--surface-highlight))] px-2 py-1 text-xs font-bold text-[hsl(var(--brand-strong))]">
                Novedad
              </span>
              <img
                src="/marcas_originales/imou_logo.png"
                alt="Imou"
                className="w-12 h-12 object-contain rounded bg-white mr-3 flex-shrink-0"
              />
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <span className="font-semibold text-white text-sm leading-tight">
                  Imou Ranger 2C
                </span>
                <span className="text-sky-100 text-xs leading-tight">
                  Camara WiFi con giro, vision nocturna y alertas al celular para quienes quieren vigilar su espacio sin complicarse.
                </span>
                <a
                  href="#"
                  className="text-xs underline text-white/80 hover:text-white mt-1"
                >
                  Conocer mas
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Message */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trabajar con marcas reconocidas nos permite ofrecer referencias originales, mejor respaldo y una compra mucho mas clara para el cliente.
          </p>
        </div>
      </div>

      {/* Carousel Animation Styles */}
      <style jsx>{`
        .brands-carousel-container {
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .brands-carousel-track {
          display: flex;
          gap: 1rem;
          animation: brands-scroll 30s linear infinite;
          will-change: transform;
        }

        .brands-carousel-track:hover {
          animation-play-state: paused;
        }

        .brands-carousel-item {
          flex-shrink: 0;
          width: 150px;
          height: 100px;
        }

        @keyframes brands-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 4));
          }
        }

        @media (max-width: 768px) {
          .brands-carousel-item {
            width: 120px;
            height: 80px;
          }

          .brands-carousel-track {
            animation-duration: 20s;
          }
        }

        @media (max-width: 640px) {
          .brands-carousel-item {
            width: 100px;
            height: 70px;
          }
        }
      `}</style>
    </section>
  )
}
