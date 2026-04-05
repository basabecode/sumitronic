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
    title: 'Cámaras Imou con IA: qué revisar antes de comprar para hogar o negocio',
    excerpt:
      'Guía práctica para elegir cámaras Imou con detección inteligente según el espacio, el uso y las condiciones reales de instalación en Colombia.',
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
      'Las cámaras Imou con funciones de inteligencia artificial ayudan a reducir falsas alarmas, diferenciar personas de vehículos o mascotas, y mejorar la lectura de eventos relevantes. Eso hace que la compra tenga más sentido para hogares, oficinas pequeñas y negocios que necesitan vigilancia útil, no solo grabación pasiva.',
      'Antes de comprar, conviene revisar tres cosas: cobertura del espacio, tipo de conexión disponible y soporte posterior. Una cámara excelente puede frustrar si el punto no tiene WiFi estable, si necesita almacenamiento adicional que nadie contempló, o si el usuario no sabe cómo configurarla después de instalarla.',
      'Para Colombia, comprar con inventario local y soporte cercano tiene una ventaja concreta: si el producto llega rápido, tiene garantía respaldada y hay alguien que puede orientar compatibilidad antes de instalar, la compra deja de ser una apuesta. Eso es lo que buscamos en cada pedido.',
    ],
    faq: [
      {
        question: '¿Qué ventaja real aporta la IA en una cámara de seguridad?',
        answer:
          'Filtra mejor los eventos relevantes y reduce notificaciones que no sirven, lo que mejora la experiencia diaria y la utilidad real del equipo.',
      },
      {
        question: '¿Una cámara Imou sirve para negocio y para hogar al mismo tiempo?',
        answer:
          'Sí, siempre que el modelo se elija según el espacio, el nivel de exposición y el tipo de monitoreo que necesitas. No todas las referencias son iguales.',
      },
    ],
  },
  {
    slug: 'wifi-7-tp-link-cuando-vale-la-pena',
    title: 'WiFi 7 de TP-Link: cuándo sí vale la pena actualizar tu red',
    excerpt:
      'No todos necesitan WiFi 7 hoy. Esta guía explica en qué casos realmente mejora tu conectividad y cómo decidir sin comprar tecnología que no vas a aprovechar.',
    image: '/blogs/wifi7_tplink.jpg',
    author: 'Mesa Técnica',
    date: '30 Mar 2026',
    publishedAt: '2026-03-30',
    category: 'Conectividad',
    pillar: 'Redes y conectividad',
    readTime: '6 min',
    keywords: ['wifi 7 colombia', 'router tp-link wifi 7', 'mejorar internet hogar'],
    content: [
      'WiFi 7 promete mayor capacidad, mejor manejo de congestión y velocidades altas, pero no siempre es la mejor compra inmediata. La pregunta correcta no es si es la tecnología más nueva, sino si resuelve un cuello de botella real en tu casa u oficina.',
      'Si tienes múltiples equipos conectados al mismo tiempo —streaming, cámaras IP, trabajo remoto y dispositivos exigentes— un router TP-Link WiFi 7 puede darte más estabilidad y mejor reparto del ancho de banda. Si tu red actual no está saturada, el retorno puede ser menor al esperado.',
      'La actualización empieza a tener más valor cuando el entorno ya demanda baja latencia, varios dispositivos activos y cobertura consistente en distintos puntos del espacio. También influye que el router se integre bien con el proveedor de internet, la distribución del espacio y los equipos que ya tienes.',
      'Comprar mejor red no es comprar el número más alto en la ficha técnica: es adquirir una base que no te obligue a improvisar dentro de seis meses. Por eso la asesoría previa y la elección por caso de uso siguen siendo más importantes que los números del catálogo.',
    ],
  },
  {
    slug: 'guia-compra-ups-respaldo-forza',
    title: 'Cómo elegir un UPS o respaldo Forza sin sobredimensionar tu compra',
    excerpt:
      'Guía directa para calcular la capacidad correcta, proteger equipos sensibles y no gastar de más ni quedarse corto en respaldo eléctrico.',
    image: '/placeholder.svg',
    author: `Equipo ${brand.name}`,
    date: '30 Mar 2026',
    publishedAt: '2026-03-30',
    category: 'Energía',
    pillar: 'Energía y respaldo',
    readTime: '5 min',
    keywords: ['ups forza colombia', 'respaldo energia hogar', 'protector para oficina'],
    content: [
      'Cuando alguien compra un UPS más grande de lo necesario, gasta de más. Cuando compra uno pequeño, expone equipos y pierde continuidad. La decisión correcta está en entender carga, tiempo de respaldo y criticidad de los dispositivos que quiere proteger.',
      'Para estaciones de trabajo, cámaras, módems, routers o puntos de caja, un UPS ayuda a mantener operación y proteger de variaciones eléctricas. No todos los casos requieren autonomía larga, pero casi todos se benefician de regulación básica y un apagado controlado cuando se va la luz.',
      'La clave es mapear qué dispositivos deben seguir encendidos, cuánto consumen y cuál es el objetivo real: apagar con seguridad, mantener conectividad o sostener una operación puntual durante varios minutos. Eso evita comprar por intuición o por lo que dijo alguien en el trabajo.',
      'En el contexto local, también importa el soporte: saber qué se instaló, cómo se reemplaza una batería y qué garantía aplica cambia completamente la confianza que da la compra.',
    ],
  },
  {
    slug: 'kit-camaras-negocio-colombia',
    title: 'Kit de cámaras para negocio: qué pedir, qué esperar y cuánto presupuestar',
    excerpt:
      'Lo que le explicamos a cada cliente que llega preguntando por seguridad para su local. Sin tecnicismos, con precios reales y decisiones claras.',
    image: '/blogs/imou_panel_solar_Z.jpg',
    author: `Equipo ${brand.name}`,
    date: '2 Abr 2026',
    publishedAt: '2026-04-02',
    category: 'Seguridad',
    pillar: 'Seguridad para hogar y negocio',
    readTime: '4 min',
    keywords: [
      'kit camaras negocio colombia',
      'sistema de vigilancia local comercial',
      'camaras seguridad cali',
      'cuanto cuesta instalar camaras',
    ],
    content: [
      'La pregunta más frecuente que recibimos es: "¿cuántas cámaras necesito para mi local?" La respuesta honesta es que depende del espacio, no del presupuesto que sobró. Un kit bien dimensionado de 4 cámaras puede ser más efectivo que 8 mal ubicadas.',
      'Para un local comercial de tamaño mediano, un punto de entrada, caja y dos zonas internas suele ser suficiente para cubrir lo esencial. Lo importante es que cada cámara tenga un propósito claro: zona ciega que no se ve desde caja, acceso al bodegón, entrada principal o área de atención.',
      'En términos de presupuesto, un kit funcional de cámaras con grabación local y acceso remoto desde el celular puede arrancar desde $800.000 COP con instalación básica incluida. Los precios varían según la marca, la resolución y si el almacenamiento es en la nube o en disco local.',
      'Lo que siempre recomendamos antes de comprar: pídanos una cotización con la distribución del espacio. No para venderle más, sino para no venderle lo que no le sirve. Un sistema de seguridad que el dueño no sabe usar no protege a nadie.',
    ],
    faq: [
      {
        question: '¿Puedo ver las cámaras desde el celular sin pagar mensualidad?',
        answer:
          'Sí. La mayoría de las referencias que manejamos permiten acceso remoto desde la app sin costo mensual, siempre que el almacenamiento sea local (tarjeta SD o disco). Solo algunos planes en la nube tienen costo adicional.',
      },
      {
        question: '¿Cuánto dura la instalación de un kit básico?',
        answer:
          'Para un local con 4 cámaras, la instalación básica puede tomar entre 2 y 4 horas dependiendo del espacio y el cableado. Le confirmamos tiempos antes de agendar.',
      },
    ],
  },
]

export const helpArticles: HelpArticle[] = [
  {
    slug: 'envios-y-seguimiento',
    title: 'Envíos y seguimiento de pedidos',
    description:
      `Tiempos de entrega, cómo rastrear tu pedido y qué esperar después de comprar en ${brand.name}.`,
    category: 'Envíos',
    keywords: ['envios sumitronic', 'seguimiento pedido', 'tiempos de entrega colombia'],
    sections: [
      {
        heading: 'Tiempos de entrega',
        body: [
          'Los envíos nacionales suelen tardar entre 2 y 5 días hábiles según la ciudad de destino y la confirmación del pago.',
          'En Cali y ciudades principales como Bogotá y Medellín, el rango habitual es más corto cuando el producto está disponible para despacho inmediato.',
          'Para municipios intermedios o zonas de difícil acceso, el tiempo puede extenderse un poco más. Siempre le confirmamos el estimado antes de cerrar el pedido para que no haya sorpresas.',
        ],
      },
      {
        heading: 'Seguimiento',
        body: [
          'Cuando su pedido entra en despacho, compartimos el número de guía y el canal para rastrear el envío con la transportadora asignada.',
          'Trabajamos con Interrapidísimo, Servientrega y Envía según disponibilidad de cobertura. Si necesita apoyo durante el trayecto, el equipo puede ayudarle a validar novedades o tiempos estimados.',
        ],
      },
      {
        heading: '¿Qué pasa si hay un retraso?',
        body: [
          'Si el pedido tarda más de lo esperado, escríbanos por WhatsApp con el número de pedido y revisamos el estado directamente con la transportadora.',
          'No lo dejamos solo con el problema: hacemos el seguimiento con usted hasta que el paquete llegue.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cuándo recibo la guía de envío?',
        answer:
          'Después de confirmar el despacho. Normalmente se comparte el mismo día o al siguiente día hábil.',
      },
      {
        question: '¿Hacen envíos a todo Colombia?',
        answer:
          'Sí. Despachamos a nivel nacional. Para zonas muy apartadas, le confirmamos cobertura y tiempos antes de tomar el pedido.',
      },
    ],
  },
  {
    slug: 'garantias-y-devoluciones',
    title: 'Garantías y devoluciones',
    description:
      'Qué cubre la garantía, cuánto tiempo aplica y cómo solicitar una revisión o devolución de forma clara.',
    category: 'Garantías',
    keywords: [
      'garantia sumitronic',
      'devoluciones tienda tecnologia',
      'reclamo de garantia colombia',
      'politica devolucion electronica',
    ],
    sections: [
      {
        heading: 'Cobertura de garantía',
        body: [
          'La mayoría de los productos electrónicos que vendemos tienen garantía de 12 meses por defectos de fabricación, salvo que la publicación del producto indique una condición distinta.',
          'La garantía cubre fallas que no son producto del uso normal: defectos de fábrica, mal funcionamiento desde el inicio o fallas sin causa externa visible.',
          'No cubre golpes, humedad, manipulaciones no autorizadas, daño por uso indebido, ni cortocircuitos causados por instalación incorrecta.',
        ],
      },
      {
        heading: 'Cómo hacer efectiva la garantía',
        body: [
          'Escríbanos por WhatsApp o correo con el número de pedido, una descripción del problema y, si es posible, una foto o video del fallo.',
          'Revisamos el caso y le indicamos si aplica cambio, reparación o devolución según la situación.',
          'El proceso depende del estado del producto, el tiempo transcurrido desde la compra y si el daño tiene causa externa identificable.',
        ],
      },
      {
        heading: 'Devoluciones por insatisfacción',
        body: [
          'Las devoluciones por insatisfacción se evalúan caso a caso. Para que apliquen, el producto debe estar en su empaque original, sin uso, con todos los accesorios incluidos.',
          'El reporte debe hacerse dentro de los primeros 5 días hábiles desde la recepción del producto.',
          'Para productos que ya fueron instalados o activados, primero validamos el estado con el equipo de soporte antes de determinar si aplica devolución.',
        ],
      },
    ],
    faq: [
      {
        question: '¿La garantía aplica si el producto ya fue instalado?',
        answer:
          'Depende del tipo de falla. Si el problema es de fabricación y no hay señales de mal uso o instalación incorrecta, la garantía puede aplicar. Siempre evaluamos el caso antes de dar una respuesta definitiva.',
      },
      {
        question: '¿Cuánto demora el proceso de garantía?',
        answer:
          'Una vez reportado el caso con evidencia, respondemos en máximo 2 días hábiles con las opciones disponibles.',
      },
    ],
  },
  {
    slug: 'pagos-y-confirmacion',
    title: 'Métodos de pago y confirmación de compra',
    description:
      'Formas de pago disponibles, cómo confirmar su compra y qué hacer si su pago queda pendiente.',
    category: 'Pagos',
    keywords: [
      'metodos de pago sumitronic',
      'nequi daviplata tienda',
      'confirmacion de compra colombia',
      'pse transferencia electronica',
    ],
    sections: [
      {
        heading: 'Métodos de pago disponibles',
        body: [
          `En ${brand.name} aceptamos Nequi, Daviplata y transferencias bancarias a las principales entidades financieras del país.`,
          'También manejamos pago contra entrega en algunos casos según la ciudad y el valor del pedido. Si tiene una necesidad puntual, consultamos con usted antes de confirmar.',
          'Para pedidos empresariales o por volumen, podemos estudiar otras condiciones de pago. Escríbanos y lo revisamos.',
        ],
      },
      {
        heading: 'Confirmación del pedido',
        body: [
          'Una vez realizado el pago, comparta el comprobante por WhatsApp o correo para agilizar la confirmación y el despacho.',
          'En algunos métodos, la verificación puede tomar hasta 1 día hábil antes de liberar el despacho. Le notificamos cuando el pedido quede confirmado.',
          'Para evitar retrasos, revise que los datos de entrega —dirección, ciudad y teléfono de contacto— estén correctos desde el inicio.',
        ],
      },
      {
        heading: 'Pago pendiente o no confirmado',
        body: [
          'Si realizó el pago y no recibió confirmación dentro de 24 horas hábiles, contáctenos con el comprobante y el número de pedido.',
          'Revisamos el estado directamente y le respondemos antes del siguiente día hábil.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Puedo pagar en efectivo?',
        answer:
          'Manejamos pago contra entrega en ciertas ciudades según el valor del pedido. Consúltenos antes de finalizar la compra para confirmar disponibilidad.',
      },
      {
        question: '¿Mi pago está seguro?',
        answer:
          'Sí. Las transferencias y pagos digitales se manejan directamente entre el comprador y la plataforma de pago. No almacenamos datos bancarios.',
      },
    ],
  },
  {
    slug: 'terminos-y-condiciones',
    title: 'Términos y Condiciones de compra',
    description:
      `Las reglas claras de la relación comercial entre ${brand.name} y sus clientes. Sin letra pequeña ni lenguaje enredado.`,
    category: 'Legal',
    keywords: [
      'terminos y condiciones sumitronic',
      'condiciones de compra tienda electronica',
      'politica comercial colombia',
    ],
    sections: [
      {
        heading: 'Quiénes somos',
        body: [
          `${brand.name} es un comercio electrónico con sede en Cali, Valle del Cauca, especializado en seguridad electrónica, conectividad, energía y repuestos tecnológicos.`,
          'Vendemos a personas naturales y empresas en todo el territorio colombiano a través de nuestra tienda en línea y canal de WhatsApp.',
        ],
      },
      {
        heading: 'Proceso de compra',
        body: [
          'Al realizar un pedido, el cliente acepta las condiciones de precio, descripción del producto y política de entrega vigentes al momento de la compra.',
          'Los precios están expresados en pesos colombianos (COP) e incluyen IVA cuando aplica. Las ofertas están sujetas a disponibilidad de inventario.',
          'La confirmación del pedido queda sujeta a verificación del pago. No se despacha ningún pedido sin pago confirmado.',
        ],
      },
      {
        heading: 'Responsabilidades del comprador',
        body: [
          'El comprador es responsable de suministrar datos de entrega correctos —dirección, ciudad, nombre del receptor y teléfono de contacto— al momento de realizar el pedido.',
          'Si el pedido no puede entregarse por datos incorrectos o ausencia del receptor, los costos de reenvío corren por cuenta del comprador.',
          'El uso de los productos adquiridos es responsabilidad exclusiva del comprador. Para instalaciones técnicas, recomendamos apoyarse en personal capacitado.',
        ],
      },
      {
        heading: 'Modificaciones y cancelaciones',
        body: [
          'Los pedidos pueden modificarse o cancelarse antes del despacho sin costo. Una vez despachado, aplican las condiciones de devolución.',
          'Nos reservamos el derecho de cancelar pedidos en caso de error de precio, falta de inventario o indicios de uso fraudulento.',
        ],
      },
      {
        heading: 'Ley aplicable',
        body: [
          'Estas condiciones se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor) y la normativa de comercio electrónico vigente.',
          'Para cualquier reclamación, el comprador puede acudir a la Superintendencia de Industria y Comercio (SIC) o a los mecanismos de resolución de conflictos previstos por la ley.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cómo puedo cancelar un pedido?',
        answer:
          'Contáctenos por WhatsApp con el número de pedido antes de que sea despachado. Una vez en camino, aplican las condiciones de devolución.',
      },
      {
        question: '¿Los precios del sitio incluyen IVA?',
        answer:
          'En la mayoría de los casos sí. Si hay alguna excepción, se indica en la ficha del producto. Ante cualquier duda, consúltenos antes de comprar.',
      },
    ],
  },
  {
    slug: 'politica-de-privacidad',
    title: 'Política de Privacidad y tratamiento de datos',
    description:
      `Cómo ${brand.name} recopila, usa y protege su información personal conforme a la Ley 1581 de 2012 de Colombia.`,
    category: 'Legal',
    keywords: [
      'politica privacidad sumitronic',
      'habeas data colombia',
      'tratamiento de datos personales tienda',
      'ley 1581 colombia',
    ],
    sections: [
      {
        heading: 'Responsable del tratamiento',
        body: [
          `${brand.name} es el responsable del tratamiento de los datos personales recopilados a través de esta plataforma.`,
          `Para ejercer sus derechos, puede escribirnos a ${brand.supportEmail} o contactarnos por WhatsApp al ${brand.whatsappDisplay}.`,
        ],
      },
      {
        heading: 'Datos que recopilamos',
        body: [
          'Recopilamos únicamente los datos necesarios para atender su compra: nombre, dirección de entrega, teléfono de contacto y correo electrónico.',
          'No solicitamos datos sensibles como información financiera directamente. Los pagos se procesan a través de plataformas externas que tienen sus propias políticas de seguridad.',
          'Si nos escribe por WhatsApp, la conversación puede ser utilizada para mejorar la atención, pero no se comparte con terceros sin su consentimiento.',
        ],
      },
      {
        heading: 'Para qué usamos sus datos',
        body: [
          'Sus datos se usan exclusivamente para: confirmar y gestionar su pedido, coordinar el despacho, enviarle actualizaciones sobre su compra y brindarle soporte postventa.',
          'No vendemos ni cedemos sus datos a terceros con fines comerciales.',
          'En caso de requerir información de seguimiento, los datos necesarios se comparten con la transportadora asignada únicamente para gestionar la entrega.',
        ],
      },
      {
        heading: 'Sus derechos como titular',
        body: [
          'Conforme a la Ley 1581 de 2012, usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales en cualquier momento.',
          'También puede revocar la autorización de tratamiento y solicitar prueba de la misma.',
          `Para ejercer cualquiera de estos derechos, contáctenos por correo a ${brand.supportEmail} indicando su nombre completo y el detalle de la solicitud.`,
        ],
      },
      {
        heading: 'Cookies y navegación',
        body: [
          'Usamos cookies técnicas para el funcionamiento del carrito de compras y la sesión del usuario. No usamos cookies de seguimiento publicitario de terceros.',
          'Puede deshabilitar las cookies desde la configuración de su navegador, aunque esto puede afectar el funcionamiento del carrito y el inicio de sesión.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Comparten mis datos con terceros?',
        answer:
          'Solo con la transportadora para gestionar la entrega, y con plataformas de pago para procesar la transacción. No los compartimos para fines publicitarios.',
      },
      {
        question: '¿Cómo solicito la eliminación de mis datos?',
        answer: `Escríbanos a ${brand.supportEmail} con su nombre y número de pedido. Procesamos la solicitud en un plazo máximo de 15 días hábiles.`,
      },
    ],
  },
  {
    slug: 'servicio-tecnico',
    title: 'Soporte técnico y asesoría postventa',
    description:
      `Cómo solicitamos soporte, qué incluye la asesoría técnica de ${brand.name} y en qué casos podemos ayudarle directamente.`,
    category: 'Soporte',
    keywords: [
      'servicio tecnico sumitronic',
      'soporte camaras seguridad cali',
      'configuracion equipos tecnologia',
      'instalacion camaras colombia',
    ],
    sections: [
      {
        heading: 'Qué incluye nuestro soporte',
        body: [
          'Brindamos orientación por WhatsApp para instalación básica, configuración inicial y uso correcto de los equipos que vendemos.',
          'Para la mayoría de referencias de cámaras, routers y UPS, podemos guiarle paso a paso por el proceso de configuración sin costo adicional.',
          'Si el equipo presenta una falla, hacemos el diagnóstico inicial de manera remota para determinar si aplica garantía o si el problema tiene solución rápida.',
        ],
      },
      {
        heading: 'Soporte presencial en Cali',
        body: [
          'Para clientes en Cali, en algunos casos podemos coordinar visita técnica o revisión directa del equipo según disponibilidad.',
          'Contáctenos primero por WhatsApp para evaluar el caso antes de agendar cualquier visita.',
        ],
      },
      {
        heading: 'Qué no cubre el soporte gratuito',
        body: [
          'El soporte técnico gratuito aplica para los productos adquiridos en nuestra tienda. No realizamos diagnósticos ni reparaciones de equipos comprados en otros establecimientos.',
          'Instalaciones complejas, cableado estructurado o configuraciones de red avanzadas pueden requerir un servicio técnico especializado externo.',
        ],
      },
      {
        heading: 'Cómo contactar soporte',
        body: [
          `Escríbanos por WhatsApp al ${brand.whatsappDisplay} en horario de atención (lunes a viernes 8 AM - 5 PM, sábados 8 AM - 2 PM).`,
          'Para agilizar la atención, indique el nombre del producto, el número de pedido y una descripción breve del problema o la duda.',
        ],
      },
    ],
    faq: [
      {
        question: '¿El soporte técnico tiene costo?',
        answer:
          'La orientación básica por WhatsApp para productos adquiridos con nosotros no tiene costo. Para servicios de instalación presencial o soporte avanzado, lo evaluamos caso a caso.',
      },
      {
        question: '¿Puedo llevar el equipo personalmente?',
        answer:
          'Sí. Estamos ubicados en Cra 3 # 72A-70, Cali. Le recomendamos avisarnos antes para confirmar disponibilidad de atención.',
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
