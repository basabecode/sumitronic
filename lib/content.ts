import { brand } from '@/lib/brand'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  publishedAt: string
  category: string
  pillar: string
  readTime: string
  keywords: string[]
  content: string[]
  faq?: Array<{
    question: string
    answer: string
  }>
}

export type HelpArticle = {
  slug: string
  title: string
  description: string
  category: string
  keywords: string[]
  sections: Array<{
    heading: string
    body: string[]
  }>
  faq?: Array<{
    question: string
    answer: string
  }>
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'camaras-imou-ia-hogar-negocio',
    title: 'Cámaras Imou con IA: qué mirar antes de comprar para hogar o negocio',
    excerpt:
      'Guía práctica para elegir cámaras Imou con detección inteligente, cobertura adecuada y compra local confiable en Colombia.',
    image: '/blogs/imou_panel_solar_Z.jpg',
    author: `Equipo ${brand.name}`,
    date: '30 Mar 2026',
    publishedAt: '2026-03-30',
    category: 'Seguridad',
    pillar: 'Seguridad para hogar y negocio',
    readTime: '5 min',
    keywords: ['camaras imou colombia', 'camara seguridad hogar', 'camara con ia'],
    content: [
      'Elegir una cámara de seguridad no debería reducirse a resolución y precio. En la práctica, la decisión correcta depende de dónde la vas a instalar, qué tipo de alertas necesitas y qué tan fácil será mantenerla operando sin fricción.',
      'Las cámaras Imou con funciones de inteligencia artificial ayudan a reducir falsas alarmas, diferenciar personas o vehículos y mejorar la lectura de eventos relevantes. Eso hace que la compra tenga más sentido para hogares, oficinas pequeñas y negocios que necesitan vigilancia útil, no solo grabación pasiva.',
      'Antes de comprar, conviene revisar tres cosas: cobertura del espacio, tipo de conexión y soporte posterior. Una cámara excelente puede frustrar si el punto no tiene WiFi estable, si necesita almacenamiento adicional o si el usuario no tiene claridad sobre instalación y configuración.',
      'Para Colombia, la ventaja de comprar con inventario local y soporte cercano es simple: menos riesgo. Si el producto llega rápido, tiene garantía y alguien puede orientar compatibilidad, la compra deja de ser una apuesta.',
    ],
    faq: [
      {
        question: '¿Qué ventaja real aporta la IA en una cámara?',
        answer:
          'Filtra mejor eventos relevantes y reduce notificaciones inútiles, lo que mejora la experiencia diaria y la utilidad comercial del equipo.',
      },
      {
        question: '¿Una cámara Imou sirve para negocio y hogar?',
        answer:
          'Sí, siempre que el modelo se elija según el espacio, el nivel de exposición y el tipo de monitoreo esperado.',
      },
    ],
  },
  {
    slug: 'wifi-7-tp-link-cuando-vale-la-pena',
    title: 'WiFi 7 de TP-Link: cuándo sí vale la pena actualizar tu red',
    excerpt:
      'No todos necesitan WiFi 7 hoy. Esta guía explica en qué casos realmente mejora la red y cómo decidir sin comprar de más.',
    image: '/blogs/wifi7_tplink.jpg',
    author: 'Mesa Técnica',
    date: '30 Mar 2026',
    publishedAt: '2026-03-30',
    category: 'Conectividad',
    pillar: 'Redes y conectividad',
    readTime: '6 min',
    keywords: ['wifi 7 colombia', 'router tp-link wifi 7', 'mejorar internet hogar'],
    content: [
      'WiFi 7 promete mayor capacidad, mejor manejo de congestión y velocidades muy altas, pero no siempre es la mejor compra inmediata. La pregunta correcta no es si es la tecnología más nueva, sino si resuelve un cuello de botella real en tu casa u oficina.',
      'Si tienes múltiples equipos conectados, streaming simultáneo, cámaras IP, trabajo remoto y dispositivos exigentes, un router TP-Link WiFi 7 puede darte más estabilidad y mejor reparto del ancho de banda. Si tu red actual no está saturada, el retorno puede ser menor.',
      'La actualización empieza a tener más valor cuando el entorno ya demanda baja latencia, varios dispositivos activos y cobertura consistente. También influye que el router se integre bien con el proveedor de internet, la distribución del espacio y los equipos cliente.',
      'Comprar mejor red no es comprar el número más alto: es adquirir una base que no te obligue a improvisar dentro de seis meses. Por eso la asesoría previa y la elección por caso de uso siguen siendo más importantes que la ficha técnica aislada.',
    ],
  },
  {
    slug: 'guia-compra-ups-respaldo-forza',
    title: 'Cómo elegir un UPS o respaldo Forza sin sobredimensionar tu compra',
    excerpt:
      'Una guía simple para calcular respaldo, proteger equipos sensibles y comprar la capacidad correcta para oficina o hogar.',
    image: '/placeholder.svg',
    author: `Equipo ${brand.name}`,
    date: '30 Mar 2026',
    publishedAt: '2026-03-30',
    category: 'Energía',
    pillar: 'Energía y respaldo',
    readTime: '5 min',
    keywords: ['ups forza colombia', 'respaldo energia hogar', 'protector para oficina'],
    content: [
      'Cuando un cliente compra un UPS más grande de lo necesario, gasta de más. Cuando compra uno pequeño, expone equipos y pierde continuidad. La decisión correcta está en entender carga, tiempo de respaldo y criticidad de los dispositivos.',
      'Para estaciones de trabajo, cámaras, módems, routers o puntos de caja, un UPS ayuda a mantener operación y proteger de variaciones eléctricas. No todos los casos requieren autonomía larga, pero casi todos se benefician de regulación básica y respaldo controlado.',
      'La clave es mapear qué dispositivos deben seguir encendidos, cuánto consumen y cuál es el objetivo: apagar con seguridad, mantener conectividad o sostener una operación puntual durante minutos. Eso evita comprar por intuición.',
      'En el contexto local, también importa el soporte: saber qué se instaló, cómo se reemplaza una batería y qué garantía aplica cambia por completo la confianza de la compra.',
    ],
  },
]

export const helpArticles: HelpArticle[] = [
  {
    slug: 'envios-y-seguimiento',
    title: 'Envíos y seguimiento de pedidos',
    description:
      `Tiempos estimados, seguimiento y que esperar despues de comprar en ${brand.name}.`,
    category: 'Soporte',
    keywords: ['envios sumitronic', 'seguimiento pedido', 'tiempos de entrega colombia'],
    sections: [
      {
        heading: 'Tiempos de entrega',
        body: [
          'Los envíos nacionales suelen tardar entre 2 y 5 días hábiles según la ciudad de destino y la confirmación del pago.',
          'En ciudades principales como Bogotá, Medellín y Cali, el rango habitual es más corto cuando el producto está disponible para despacho inmediato.',
        ],
      },
      {
        heading: 'Seguimiento',
        body: [
          'Cuando el pedido entra en despacho, compartimos el número de guía y el canal para seguimiento con la transportadora correspondiente.',
          'Si necesitas apoyo durante el trayecto, el equipo comercial puede ayudarte a validar novedades o tiempos estimados.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cuándo recibo la guía de envío?',
        answer: 'Después de confirmar el despacho. Normalmente se comparte el mismo día o al siguiente día hábil.',
      },
    ],
  },
  {
    slug: 'garantias-y-devoluciones',
    title: 'Garantías y devoluciones',
    description:
      'Coberturas, exclusiones y pasos básicos para solicitar una revisión o devolución.',
    category: 'Políticas',
    keywords: ['garantia sumitronic', 'devoluciones tienda tecnologia', 'reclamo de garantia'],
    sections: [
      {
        heading: 'Garantía',
        body: [
          'La mayoría de los productos electrónicos cuentan con garantía de 12 meses por defectos de fabricación, salvo que la publicación indique una condición distinta.',
          'La garantía no cubre golpes, humedad, manipulaciones no autorizadas o daño por uso indebido.',
        ],
      },
      {
        heading: 'Devoluciones',
        body: [
          'Las devoluciones por insatisfacción están sujetas a validación del estado del producto, empaque y accesorios completos.',
          'Para acelerar el proceso, conviene reportar la solicitud con número de pedido, evidencia y motivo claro.',
        ],
      },
    ],
    faq: [
      {
        question: '¿La devolución aplica si el producto ya fue instalado?',
        answer:
          'Depende del estado final y del tipo de producto. Si hubo uso, instalación o manipulación, primero se valida el caso con soporte.',
      },
    ],
  },
  {
    slug: 'pagos-y-confirmacion',
    title: 'Pagos y confirmación de compra',
    description:
      'Métodos de pago disponibles, verificación y recomendaciones para compras sin fricción.',
    category: 'Pagos',
    keywords: ['metodos de pago sumitronic', 'nequi daviplata tienda', 'confirmacion de compra'],
    sections: [
      {
        heading: 'Métodos disponibles',
        body: [
          `${brand.name} trabaja con opciones como Nequi, Daviplata y transferencias bancarias directas segun disponibilidad operativa.`,
          'En algunos casos, la confirmación puede requerir validación manual antes de liberar el despacho.',
        ],
      },
      {
        heading: 'Confirmación',
        body: [
          'Para evitar retrasos, revisa bien datos de contacto, dirección y soporte del comprobante cuando el método lo requiera.',
          'Si una compra queda pendiente, soporte puede ayudarte a validarla más rápido.',
        ],
      },
    ],
  },
]

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug)
}

export function getHelpArticleBySlug(slug: string) {
  return helpArticles.find(article => article.slug === slug)
}
