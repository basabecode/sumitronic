/**
 * lib/content.ts — Fuente única de contenido estático indexable
 *
 * BLOG: Agrega un objeto a `blogPosts[]` → aparece automáticamente en
 *   /blog, /blog/[slug] y en el sitemap sin tocar ningún otro archivo.
 *
 * AYUDA: Agrega un objeto a `helpArticles[]` → aparece en /help y sitemap.
 *
 * MARCAS: Edita lib/brands.ts → aparece en /marcas, /marcas/[slug] y sitemap.
 * PRODUCTOS/CATEGORÍAS: Se leen directo de la DB → crecen solos al cargarlos.
 */
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
    slug: 'ia-analiticas-camaras-seguridad-2026',
    title: 'Inteligencia Artificial y Analíticas: El futuro de las cámaras IP en 2026',
    excerpt:
      'Detección de humanos, vehículos, conteo de personas y cruce de línea. Descubre cómo las nuevas analíticas de Dahua, Hikvision e Imou están eliminando las falsas alarmas.',
    image: '/blogs/camara_ia_analiticas.png',
    author: `Equipo ${brand.name}`,
    date: '28 Abr 2026',
    publishedAt: '2026-04-28',
    category: 'Seguridad',
    pillar: 'Conocimiento experto',
    readTime: '7 min',
    keywords: [
      'analiticas de video',
      'deteccion de humanos y vehiculos',
      'hikvision acusense',
      'dahua wizsense',
      'conteo de personas camaras',
    ],
    content: [
      'La seguridad electrónica ha dejado de ser simplemente "grabar video" para convertirse en un sistema de datos inteligente. En 2026, las marcas líderes como Hikvision (con su tecnología AcuSense) y Dahua (con WizSense) han perfeccionado algoritmos de Deep Learning que permiten a las cámaras entender qué están viendo.',
      '## Detección Humana y Vehicular: Adiós a las falsas alarmas',
      'El mayor problema de las cámaras antiguas era el "ruido": el movimiento de un árbol, una mascota o la lluvia activaban una notificación en el celular. Con la IA actual, la cámara filtra el 99% de estos eventos. Solo recibirás una alerta si un humano cruza una zona prohibida o si un vehículo se parquea donde no debe.',
      '## Analíticas avanzadas: Conteo y Mapa de calor',
      'Para los negocios, estas cámaras son ahora herramientas de marketing. El **Conteo de Personas** permite saber cuántos clientes entraron al local por hora. El **Mapa de Calor** indica qué pasillos son los más visitados. Marcas como Hanwha y Vivotek han llevado esto a un nivel profesional que antes solo estaba disponible para grandes superficies.',
      '## Protección Perimetral y Cruce de Línea',
      'Ya no dependes de ver la grabación después del robo. El **Cruce de Línea** permite dibujar una frontera virtual. Si alguien la pisa, la cámara puede activar una sirena local, luces estroboscópicas y mandarte un video de 10 segundos al celular en tiempo real.',
    ],
    faq: [
      {
        question: '¿Necesito un grabador especial para usar analíticas?',
        answer:
          'Muchas cámaras IP modernas procesan la analítica internamente (Edge Analytics). Sin embargo, para sacar el máximo provecho y tener un historial organizado, se recomienda un NVR compatible con la misma tecnología (ej: NVR AcuSense para cámaras AcuSense).',
      },
      {
        question: '¿Estas cámaras pueden diferenciar entre un gato y una persona?',
        answer:
          'Sí, gracias a los algoritmos de Deep Learning que identifican patrones de movimiento y siluetas específicas de humanos y vehículos.',
      },
    ],
  },
  {
    slug: 'visuales-camaras-wifi-color-nocturno',
    title: 'Cámaras WiFi 2026: Visión Nocturna a Color y Estabilidad WiFi 6',
    excerpt:
      'La oscuridad ya no es un obstáculo. Analizamos las mejoras visuales de Imou, Tapo y EZVIZ, y cómo el WiFi 6 está transformando la estabilidad de la vigilancia hogareña.',
    image: '/blogs/camara_color_nocturno.png',
    author: 'Mesa Técnica',
    date: '28 Abr 2026',
    publishedAt: '2026-04-28',
    category: 'Smart Home',
    pillar: 'Conocimiento experto',
    readTime: '6 min',
    keywords: [
      'vision nocturna a color',
      'full color dahua',
      'colorvu hikvision',
      'wifi 6 camaras seguridad',
      'imou full color',
    ],
    content: [
      'Si todavía crees que las cámaras de seguridad ven en blanco y negro de noche, te estás perdiendo de la mayor revolución visual de la década. Tecnologías como **Full Color** (Dahua) y **ColorVu** (Hikvision) permiten ver colores vibrantes incluso en oscuridad casi total.',
      '## Full Color y Dual Light: ¿Cómo funcionan?',
      'A diferencia del infrarrojo tradicional que se ve gris, estas cámaras usan sensores de alta sensibilidad y aperturas de lente muy grandes (f/1.0). Cuando la luz es insuficiente, activan un LED de luz cálida suave que no solo ilumina la escena para el sensor, sino que sirve como luz de cortesía o disuasión.',
      '## El salto al WiFi 6 y WiFi 7',
      'El mayor dolor de cabeza de las cámaras WiFi era la desconexión. Las nuevas líneas de Imou, Tapo y EZVIZ ya integran **WiFi 6**. Esto permite que si tienes 4 o 6 cámaras en casa, no saturen tu red. El WiFi 6 maneja mucho mejor la congestión de datos, asegurando que el video en vivo cargue instantáneamente en tu celular.',
      '## Audio Bidireccional y Sirenas Integradas',
      'La tendencia para 2026 es la interactividad. Ya no solo miras; ahora actúas. Desde la aplicación puedes hablar a través de la cámara (ideal para recibir domicilios o asustar intrusos) y activar sirenas de 110dB que alertarán a todo el vecindario en caso de emergencia.',
    ],
    faq: [
      {
        question: '¿La luz nocturna de la cámara molesta a los vecinos?',
        answer:
          'No necesariamente. Los modelos "Smart Dual Light" solo activan la luz blanca cuando detectan a una persona, manteniéndose en modo infrarrojo discreto el resto del tiempo.',
      },
      {
        question: '¿Puedo instalar cámaras WiFi 6 con un router viejo?',
        answer:
          'Sí, son retrocompatibles. Sin embargo, para disfrutar de la estabilidad y velocidad mejoradas, lo ideal es tener un router que también soporte WiFi 6 (AX).',
      },
    ],
  },
  {
    slug: 'comprar-seguridad-sumitronic-vs-mercadolibre',
    title: 'Comprar cámaras en Sumitronic vs Grandes Plataformas: ¿Vale la pena ahorrar $20.000?',
    excerpt:
      'Si una cámara no configura, ¿a quién llamas? Descubre por qué comprar seguridad en sitios como MercadoLibre o Amazon puede salir caro, y cuál es el valor real del respaldo local en Colombia.',
    image: '/blogs/blog_comparativa_tiendas.png',
    author: `Equipo ${brand.name}`,
    date: '16 Abr 2026',
    publishedAt: '2026-04-16',
    category: 'Comparativas',
    pillar: 'Conocimiento experto',
    readTime: '6 min',
    keywords: [
      'sumitronic vs mercadolibre',
      'comprar camaras de seguridad',
      'opiniones sumitronic colombia',
      'alternativa mercadolibre electronica',
    ],
    content: [
      'Las plataformas genéricas como MercadoLibre o Amazon son excelentes para comprar zapatos o forros de celular. Pero cuando compras seguridad electrónica, redes o repuestos especializados, el panorama cambia drásticamente. El problema rara vez está en el tiempo de envío; el problema explota cuando abres la caja y te enfrentas a la instalación.',
      'En plataformas grandes, estás comprándole a un "cajamoviente": alguien que importa 5 contenedores de tecnología surtida, las carga en la web con descripciones automáticas y nunca en su vida ha empalmado un cable UTP o configurado una IP en un NVR.',
      'En Sumitronic, vendemos exactamente lo mismo, pero cambiamos radicalmente la postventa. Nuestro modelo de negocio no depende de que el empaque llegue bonito, depende de que **el equipo quede funcionando en tu casa o negocio**.',
      '## 1. El gran problema: Configuración y Soporte',
      '¿Qué pasa cuando la cámara Imou no genera el código QR? En un marketplace tradicional debes iniciar una disputa engorrosa que bloquea tu dinero, o ver horas de tutoriales de YouTube desactualizados. En Sumitronic nos escribes al WhatsApp; nosotros simulamos la falla aquí en nuestros escritorios en Cali y te enviamos la solución exacta paso a paso.',
      '## 2. Garantía local real',
      'Las garantías de 3 a 6 meses de los importadores masivos suelen estar condicionadas a procesos absurdos. Nosotros manejamos garantía oficial de 12 meses. Si la tarjeta para TV que nos compraste llega frita o no encaja porque tu modelo tenía una variable oculta, te respondemos sin enviar tus datos a un ticket automatizado en el extranjero.',
      'No somos una bodega anónima de internet. Somos tu aliado técnico en Colombia. Comprar aquí significa tener línea directa con ingenieros y especialistas que ya han instalado y probado cada referencia que te vendemos.',
    ],
    faq: [
      {
        question: '¿Los precios de Sumitronic incluyen asesoría?',
        answer:
          'Sí, totalmente gratis. Al confirmar tu compra, se activa nuestro soporte postventa por WhatsApp para ayudarte con cualquier traba durante el encendido o uso regular del equipo.',
      },
      {
        question: '¿Despachan tan rápido como MercadoLibre?',
        answer:
          'Para compras confirmadas antes del mediodía en día hábil, el despacho sale en la tarde del mismo día con transportadoras nacionales express (Interrapidisimo, Servientrega).',
      },
    ],
  },
  {
    slug: 'camaras-originales-vs-replicas-genericas-wifi',
    title: 'Cámaras Originales vs Réplicas Genéricas WiFi: Lo barato sale caro',
    excerpt:
      'Ese kit de 4 cámaras WiFi por el precio de una suena perfecto... hasta que te das cuenta de los servidores inseguros, fallos de señal y falta total de marca. Aprende a detectarlas.',
    image: '/blogs/blog_original_vs_fake.png',
    author: 'Mesa Técnica',
    date: '15 Abr 2026',
    publishedAt: '2026-04-15',
    category: 'Comparativas',
    pillar: 'Conocimiento experto',
    readTime: '5 min',
    keywords: [
      'camaras wifi originales vs falsas',
      'camara generica v380',
      'como saber si una camara dahua es original',
      'riesgos camaras genericas',
    ],
    content: [
      'Si entras a internet a buscar "cámara WiFi", te inundarán miles de ofertas con forma de antenitas blancas. El empaque promete 4K, visión a colores en la noche y seguimiento rotundo por costos equivalentes a lo que cuesta una cena. Pero hay una razón real por la que marcas como Dahua, Imou o TP-Link cuestan más: software y seguridad.',
      '## Servidores huérfanos y apps inestables',
      'Las cámaras genéricas baratas te obligan a descargar aplicaciones de terceros (usualmente chinas sin auditoría). Estas aplicaciones tienen servidores inestables; en el momento exacto en que alguien entre a tu casa y necesites revisar la grabación de emergencia en el celular, la app dirá "Conectando al servidor..." y nunca cargará.',
      '## Seguridad y vulnerabilidad extrema',
      'Una cámara original de una marca respaldada utiliza encriptación de datos, protocolos SSL y obliga a crear contraseñas fuertes. Una cámara que cuesta $50.000 COP importada suele conectarse mediante P2P sin encriptar. Literalmente, podrías estar subiendo el video de tu sala de estar a ojos desconocidos sin saberlo.',
      'En conclusión: la seguridad no es un lugar para ahorrar dinero comprando copias sin marca. Con referencias desde los $120.000 COP en la línea Imou en Sumitronic, obtienes servidores alojados en AWS, autenticación de dos pasos, actualizaciones de firmware recurrentes y tranquilidad absoluta de quién ve tus datos.',
    ],
  },
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
    image: '/blogs/blog_ups_forza.png',
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
    image: '/blogs/blog_business_cams.png',
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
  {
    slug: 'armar-smart-home-colombia-sin-ser-tecnico',
    title: 'Cómo armar tu primer sistema smart home en Colombia sin ser técnico',
    excerpt:
      'Guía paso a paso para instalar cámaras WiFi, timbre inteligente y cerradura desde el celular. Sin cableado complicado ni conocimientos técnicos.',
    image: '/blogs/imou_ranger_dual_hogar.jpg',
    author: `Equipo ${brand.name}`,
    date: '10 Abr 2026',
    publishedAt: '2026-04-10',
    category: 'Smart Home',
    pillar: 'Smart home para todos',
    readTime: '6 min',
    keywords: [
      'smart home colombia',
      'hogar inteligente colombia',
      'instalar camaras wifi sin tecnico',
      'como armar smart home',
    ],
    content: [
      'Un sistema smart home no requiere derribar paredes ni contratar un técnico para cada paso. La mayoría de los dispositivos actuales se instalan en menos de 30 minutos y se configuran desde el celular con la app del fabricante.',
      'El punto de partida es el WiFi. Si tu router no llega con buena señal a los puntos donde vas a instalar las cámaras o el timbre, todo lo demás falla. Antes de comprar cualquier dispositivo, revisa la cobertura en cada rincón donde lo vas a poner. Un router de doble banda con buena cobertura es la base del sistema.',
      'El segundo paso es elegir el ecosistema. IMOU, por ejemplo, maneja todo desde una sola app: cámaras interiores, exteriores, timbres y cerraduras. Eso simplifica mucho porque no terminas con cuatro apps distintas para cuatro dispositivos distintos.',
      'El orden que recomendamos para armar el sistema desde cero: primero la cámara de entrada o sala, luego el timbre inteligente en la puerta principal, y si quieres dar el siguiente paso, la cerradura inteligente. Cada uno funciona solo, pero juntos forman un sistema que tiene lógica.',
      'Lo que más nos consultan es si se necesita un técnico para instalarlo. La respuesta honesta: para los dispositivos WiFi que vendemos, no. El montaje es básico, la configuración es por app y el soporte lo resolvemos por WhatsApp si algo no queda claro.',
    ],
    faq: [
      {
        question: '¿Qué necesito tener antes de comprar el primer dispositivo smart home?',
        answer:
          'Una red WiFi estable que llegue al punto donde lo vas a instalar. Sin eso, ningún dispositivo inalámbrico funciona bien. Si tienes dudas de cobertura, antes de las cámaras puede valer la pena revisar el router.',
      },
      {
        question: '¿Los dispositivos IMOU son compatibles entre sí?',
        answer:
          'Sí. Cámaras, timbres y cerraduras IMOU se gestionan desde la misma app. No necesitas aprender varias plataformas.',
      },
      {
        question: '¿Puedo instalar todo yo mismo o necesito ayuda?',
        answer:
          'Para los dispositivos WiFi, la instalación física es sencilla y la configuración es por app. Si en algún paso tienes dudas, nos escribes por WhatsApp y te ayudamos.',
      },
    ],
  },
  {
    slug: 'camara-solar-imou-sin-cables-colombia',
    title: 'Cámara solar IMOU: vigilancia sin cables ni facturas eléctricas altas',
    excerpt:
      'Las cámaras solares IMOU funcionan con panel solar y batería. No necesitan tomacorriente ni instalación eléctrica. Esto es lo que debes saber antes de comprar.',
    image: '/blogs/imou_solar_bala.jpg',
    author: `Equipo ${brand.name}`,
    date: '11 Abr 2026',
    publishedAt: '2026-04-11',
    category: 'Smart Home',
    pillar: 'Cámaras y vigilancia',
    readTime: '5 min',
    keywords: [
      'camara solar colombia',
      'camara imou solar',
      'camara sin cables exterior',
      'camara bateria solar hogar',
    ],
    content: [
      'La cámara solar resuelve el problema que más frena la instalación de cámaras exteriores en Colombia: no hay tomacorriente cerca. En jardines, garajes, fachadas y zonas sin electricidad, una cámara con panel solar y batería integrada se instala en minutos y no genera costo eléctrico adicional.',
      'Los modelos IMOU con panel solar usan la batería para funcionar de noche y los días nublados, y se recargan con luz natural durante el día. En ciudades colombianas con buen nivel de sol como Cali, Medellín y Barranquilla, la autonomía es muy buena. En zonas más lluviosas o con poca luz directa hay que revisar la exposición del panel.',
      'La instalación es la parte más fácil: un tornillo en la pared, el panel orientado hacia donde caiga más sol, y la cámara conectada a tu WiFi por app. Sin electricista, sin cableado, sin obra.',
      'Algo importante que aclaramos siempre: estas cámaras graban por movimiento o evento, no de forma continua 24/7. Eso alarga la duración de la batería y reduce el almacenamiento necesario, pero si necesitas grabación continua, una cámara con cable eléctrico es más adecuada.',
      'Para quién es ideal: casas con jardín o patio sin toma eléctrica cercana, fachadas, zonas de parqueo y cualquier punto exterior donde no quieras hacer obra para pasar un cable.',
    ],
    faq: [
      {
        question: '¿La cámara solar funciona de noche?',
        answer:
          'Sí. Tiene batería integrada que se carga durante el día. De noche funciona con la batería y activa visión nocturna automáticamente.',
      },
      {
        question: '¿Cuánto sol necesita al día para funcionar bien?',
        answer:
          'Con 3 a 4 horas de luz solar directa la batería se mantiene. En días muy nublados puede bajar el nivel, pero los modelos IMOU están optimizados para climas variables.',
      },
      {
        question: '¿Se puede robar fácilmente al no tener cables?',
        answer:
          'Se instala con tornillos en la pared. No es más fácil de robar que una cámara con cable. Además, si alguien la intenta bajar, ya grabó el intento.',
      },
    ],
  },
  {
    slug: 'cerradura-inteligente-colombia-guia-compra',
    title: 'Cerradura inteligente en Colombia: qué modelos instalar y cómo funcionan',
    excerpt:
      'Huella dactilar, PIN, NFC y app desde el celular. Las cerraduras inteligentes ya son una opción real para apartamentos y casas en Colombia. Esto es lo que necesitas saber.',
    image: '/blogs/blog_smart_lock.png',
    author: `Equipo ${brand.name}`,
    date: '12 Abr 2026',
    publishedAt: '2026-04-12',
    category: 'Smart Home',
    pillar: 'Acceso y seguridad',
    readTime: '5 min',
    keywords: [
      'cerradura inteligente colombia',
      'cerradura huella digital colombia',
      'cerradura wifi apartamento',
      'imou cerradura smart',
    ],
    content: [
      'Una cerradura inteligente reemplaza la llave física por huella dactilar, código PIN, tarjeta NFC o el celular. No necesitas cambiar toda la cerradura del apartamento: se instala sobre el cilindro existente en muchos casos, o con un reemplazo estándar en otros.',
      'En Colombia el caso de uso más común es el apartamento: llaves que se pierden, visitas que necesitan acceso temporal, empleados del hogar con horario definido. Una cerradura inteligente resuelve todo eso sin duplicar llaves ni cambiar cerraduras completas.',
      'La IMOU CUBO1 que manejamos tiene huella dactilar, NFC y PIN. Se conecta al WiFi y desde la app puedes dar acceso temporal a quien necesites, ver quién entró y a qué hora, y bloquear el acceso de alguien sin llamarle. También funciona sin internet si la red cae.',
      'Algo que pregunta mucha gente: ¿qué pasa si se va la luz o se descarga la batería? Las cerraduras inteligentes tienen batería propia que dura meses, y la mayoría tienen puerto de emergencia para cargar externamente si llega al límite.',
      'La instalación para alguien con destornillador y 20 minutos libres es totalmente manejable. El cilindro estándar encaja en la mayoría de puertas de apartamento en Colombia. Si tienes dudas sobre compatibilidad con tu cerradura actual, nos escribes antes de comprar.',
    ],
    faq: [
      {
        question: '¿Funciona si se va el internet?',
        answer:
          'Sí. La huella, el PIN y el NFC funcionan sin conexión a internet. El WiFi solo se necesita para las funciones remotas desde la app.',
      },
      {
        question: '¿Puedo instalarla yo mismo?',
        answer:
          'En la mayoría de puertas de apartamento sí. Se necesita un destornillador y seguir las instrucciones de la app. Si tienes dudas con tu puerta específica, nos escribes y te orientamos.',
      },
      {
        question: '¿Puedo dar acceso temporal a alguien?',
        answer:
          'Sí. Desde la app puedes crear usuarios con acceso limitado por fecha y hora. Ideal para empleados del hogar, visitantes o inquilinos temporales.',
      },
    ],
  },
  {
    slug: 'cual-router-para-camaras-wifi-hogar',
    title: 'Cuál router comprar para que tus cámaras WiFi funcionen sin cortes',
    excerpt:
      'El router es la base del smart home. Si falla la señal, fallan las cámaras. Esta guía explica qué buscar en un router para que todo funcione junto.',
    image: '/blogs/blog_wifi_router.png',
    author: `Equipo ${brand.name}`,
    date: '13 Abr 2026',
    publishedAt: '2026-04-13',
    category: 'Conectividad',
    pillar: 'Redes y conectividad',
    readTime: '5 min',
    keywords: [
      'router para camaras wifi colombia',
      'mejor router hogar inteligente',
      'mercusys router colombia',
      'router tenda colombia',
    ],
    content: [
      'Muchas personas compran cámaras WiFi excelentes y después se quejan de que se desconectan, graban con retraso o no mandan notificaciones a tiempo. El problema casi nunca es la cámara: es el router.',
      'Una cámara WiFi transmite video en tiempo real. Eso requiere una señal estable, no solo una señal que llegue. Un router de entrada de gama con muchos dispositivos conectados puede saturarse y empezar a soltar conexiones, especialmente en las horas de más tráfico.',
      'Lo que buscamos en un router para smart home: doble banda (2.4 GHz para las cámaras, 5 GHz para los dispositivos que necesitan más velocidad), buena cobertura para que llegue a los rincones donde van las cámaras, y capacidad para manejar varios dispositivos activos al mismo tiempo.',
      'Mercusys y Tenda ofrecen routers con esas características a precios razonables para el mercado colombiano. No es necesario comprar el router más caro del mercado para que funcionen 4 cámaras y un timbre inteligente.',
      'Un dato práctico: las cámaras IMOU funcionan en la banda de 2.4 GHz. Si tu router solo emite en 5 GHz o mezcla ambas bandas con el mismo nombre, puede haber problemas de conexión. Asegúrate de que la red de 2.4 GHz esté activa y con un nombre separado.',
    ],
    faq: [
      {
        question: '¿Cuántas cámaras puede manejar un router doméstico?',
        answer:
          'Un router de calidad media puede manejar cómodamente entre 4 y 8 cámaras junto con otros dispositivos del hogar. Si tienes más, vale la pena un router con mayor capacidad de conexiones simultáneas.',
      },
      {
        question: '¿Las cámaras IMOU funcionan con cualquier router?',
        answer:
          'Sí, siempre que el router emita en 2.4 GHz. La mayoría de routers modernos lo hacen, pero algunos equipos del operador de internet tienen configuraciones que lo limitan.',
      },
      {
        question: '¿Qué hago si la señal no llega al punto donde quiero instalar la cámara?',
        answer:
          'Un extensor de señal o un segundo router en modo repetidor suele resolver eso sin cambiar todo el sistema. También tenemos opciones de cámara con conexión 4G para zonas sin WiFi.',
      },
    ],
  },
  {
    slug: 'timbre-camara-apartamento-colombia',
    title: 'Timbre con cámara: sabe quién llega sin abrir la puerta',
    excerpt:
      'El video timbre reemplaza el citófono viejo y le da control real sobre quién entra. Sin instalación eléctrica complicada y con acceso desde el celular estés donde estés.',
    image: '/blogs/imou_solar_bala_2.jpg',
    author: `Equipo ${brand.name}`,
    date: '14 Abr 2026',
    publishedAt: '2026-04-14',
    category: 'Smart Home',
    pillar: 'Acceso y seguridad',
    readTime: '4 min',
    keywords: [
      'timbre con camara colombia',
      'video timbre apartamento',
      'imou doorbell colombia',
      'timbre inteligente sin citofono',
    ],
    content: [
      'Un video timbre resuelve algo concreto: saber quién toca sin levantarse, hablarle desde el celular aunque no estés en casa, y grabar quién llegó cuando no había nadie. Eso vale en un apartamento, en una casa o en cualquier entrada donde hoy dependen de un citófono que solo suena.',
      'El IMOU Doorbell 2S funciona con WiFi y batería recargable. No necesita cableado eléctrico especial: se monta con dos tornillos, se conecta a tu red y en 10 minutos ya está funcionando. Desde la app ves en tiempo real quién está en la puerta y hablas con ellos aunque estés en otro ciudad.',
      'Lo que más sorprende a quien lo instala por primera vez es la detección de movimiento. El timbre avisa cuando alguien se acerca a la puerta, no solo cuando toca. Eso permite ver a quien merodeó o dejó un paquete sin tocar.',
      'El almacenamiento es en tarjeta SD o en la nube de IMOU con plan opcional. Sin mensualidad, las grabaciones se guardan en la tarjeta que insertas tú. Con el plan de nube puedes acceder al historial desde cualquier lugar.',
      'Para apartamentos en conjunto cerrado donde el portero controla la entrada, el video timbre complementa ese sistema: sirve para la puerta del propio apartamento, no la del conjunto. Muchos usuarios lo instalan junto con la cerradura inteligente para tener el control completo de su puerta.',
    ],
    faq: [
      {
        question: '¿Funciona si no estoy en casa?',
        answer:
          'Sí. Mientras tu celular tenga internet, puedes ver la imagen en vivo, hablar con quien toca y recibir alertas de movimiento desde cualquier parte.',
      },
      {
        question: '¿Necesita cableado eléctrico para instalarlo?',
        answer:
          'No. El IMOU Doorbell 2S tiene batería recargable. Se monta con tornillos y se conecta a tu WiFi. Sin electricista ni obra.',
      },
      {
        question: '¿Graba todo el tiempo o solo cuando toca el timbre?',
        answer:
          'Graba por eventos: cuando alguien toca o cuando detecta movimiento. Eso ahorra batería y almacenamiento. También puedes revisar el historial de grabaciones desde la app.',
      },
    ],
  },
]

export const helpArticles: HelpArticle[] = [
  {
    slug: 'envios-y-seguimiento',
    title: 'Envíos y seguimiento de pedidos',
    description: `Tiempos de entrega, cómo rastrear tu pedido y qué esperar después de comprar en ${brand.name}.`,
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
    description: `Las reglas claras de la relación comercial entre ${brand.name} y sus clientes. Sin letra pequeña ni lenguaje enredado.`,
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
    description: `Cómo ${brand.name} recopila, usa y protege su información personal conforme a la Ley 1581 de 2012 de Colombia.`,
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
    description: `Cómo solicitamos soporte, qué incluye la asesoría técnica de ${brand.name} y en qué casos podemos ayudarle directamente.`,
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
