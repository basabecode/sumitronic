export type BrandProfile = {
  name: string
  slug: string
  logo: string
  carouselLogoClass: string
  panelLogoClass: string
  category: string
  summary: string
  salesAngle: string
  useCases: string[]
  lineupTitle: string
  lineupCopy: string
  focusTitle: string
  accentClass: string
  seoDescription: string
  seoKeywords: string[]
}

export const BRAND_PROFILES: BrandProfile[] = [
  {
    name: 'Dahua',
    slug: 'dahua',
    logo: '/marcas_originales/dahua-logo-png.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'CCTV y videovigilancia',
    summary:
      'Linea fuerte en videovigilancia, videoporteros y control de acceso para negocio, conjunto y proyecto residencial.',
    salesAngle:
      'Se mueve bien cuando el cliente necesita cubrir varios puntos, grabar con estabilidad y dejar el sistema listo para crecer.',
    useCases: ['Locales y bodegas', 'CCTV cableado', 'Proyectos con varias camaras'],
    lineupTitle: 'Lo que mas piden de Dahua',
    lineupCopy:
      'XVR, DVR, domos, camaras tipo bala y equipos para ampliar instalaciones ya montadas o arrancar proyectos nuevos.',
    focusTitle: 'Cuando el cliente busca vigilancia mas estructurada',
    accentClass: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    seoDescription:
      'Dahua es uno de los fabricantes de videovigilancia mas reconocidos a nivel mundial. En SUMITRONIC distribuimos camaras Dahua, DVR, XVR, domos PTZ, videoporteros y equipos de control de acceso con respaldo tecnico local en Cali, Colombia. Ideal para proyectos residenciales, conjuntos, bodegas y negocios que necesitan una solucion de CCTV robusta y escalable.',
    seoKeywords: [
      'camaras Dahua Colombia',
      'DVR Dahua Cali',
      'CCTV Dahua',
      'videovigilancia Dahua',
      'camaras de seguridad Dahua',
      'sistema CCTV Colombia',
      'DVR 8 canales Dahua',
      'camara domo Dahua',
    ],
  },
  {
    name: 'Imou',
    slug: 'imou',
    logo: '/marcas_originales/imou_logo.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'Seguridad WiFi',
    summary:
      'Camaras WiFi, timbres, mirillas y cerraduras pensadas para monitoreo diario desde la app y una puesta en marcha sencilla.',
    salesAngle:
      'Suele gustar en hogar y negocio pequeno porque permite vigilar rapido sin meterse en una instalacion mas pesada.',
    useCases: ['Casa y apartamento', 'Negocio pequeno', 'Monitoreo desde app'],
    lineupTitle: 'Lo que mas sale de Imou',
    lineupCopy:
      'Camaras WiFi con giro, vision nocturna, audio y deteccion inteligente para quien quiere controlar todo desde el celular.',
    focusTitle: 'Ideal para quien quiere vigilar sin complicarse',
    accentClass: 'border-sky-200 bg-sky-50 text-sky-800',
    seoDescription:
      'Imou es la marca de seguridad inteligente del grupo Dahua, especializada en dispositivos WiFi de facil instalacion. En SUMITRONIC encontraras camaras Imou con deteccion de movimiento, vision nocturna en color, audio bidireccional, timbres inteligentes y cerraduras digitales. Perfectas para hogar, apartamento o negocio pequeno que quiere monitorear desde el celular.',
    seoKeywords: [
      'camaras Imou Colombia',
      'camara WiFi Imou',
      'seguridad hogar Imou',
      'camara inteligente Colombia',
      'timbre con camara Imou',
      'camara Imou Cali',
      'camara vigilancia WiFi',
      'Imou app Colombia',
    ],
  },
  {
    name: 'Logitech',
    slug: 'logitech',
    logo: '/marcas_originales/logitech-logo.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'Perifericos y accesorios',
    summary:
      'Mouse, teclados, diademas, webcams y accesorios que se mueven bien en trabajo, estudio, home office y gaming.',
    salesAngle:
      'Tiene salida constante porque el cliente la reconoce facil y la busca para renovar equipos de uso diario.',
    useCases: ['Gaming', 'Home office', 'Accesorios de uso diario'],
    lineupTitle: 'Lo que mas consultan de Logitech',
    lineupCopy:
      'Mouse, diademas, teclados y webcams para puestos de trabajo mas comodos, clases virtuales o espacios gamer.',
    focusTitle: 'Para escritorio, estudio o juego con mejor comodidad',
    accentClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    seoDescription:
      'Logitech es la marca de perifericos mas reconocida a nivel mundial. En SUMITRONIC distribuimos mouse, teclados, auriculares, webcams y accesorios Logitech para home office, gaming y uso profesional. Encontraras la linea G para gaming, la serie MX para productividad y opciones para clases virtuales y trabajo remoto con entrega en Cali y todo Colombia.',
    seoKeywords: [
      'mouse Logitech Colombia',
      'teclado Logitech Cali',
      'auriculares Logitech gaming',
      'webcam Logitech Colombia',
      'Logitech G Colombia',
      'perifericos Logitech',
      'mouse inalambrico Logitech',
      'home office Logitech',
    ],
  },
  {
    name: 'Forza',
    slug: 'forza',
    logo: '/marcas_originales/forza logo.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'Energia y respaldo',
    summary:
      'UPS, reguladores, protectores y soluciones de respaldo para oficina, punto de venta y equipos sensibles.',
    salesAngle:
      'Es de las primeras opciones cuando hay apagones, variaciones de voltaje o necesidad de proteger computadores y red.',
    useCases: ['UPS para negocio', 'Respaldo en oficina', 'Energia portatil'],
    lineupTitle: 'Lo que mas se mueve de Forza',
    lineupCopy:
      'UPS interactivos, reguladores y equipos portatiles para mantener operaciones basicas y reducir riesgos por energia.',
    focusTitle: 'Muy buscada para proteger equipos y evitar paradas',
    accentClass: 'border-amber-200 bg-amber-50 text-amber-900',
    seoDescription:
      'Forza Power Technologies ofrece soluciones de energia confiables para hogar, oficina y negocio. En SUMITRONIC distribuimos UPS interactivos y en linea, reguladores de voltaje, protectores de corriente y baterias de respaldo Forza. Ideales para proteger computadores, servidores, equipos de red y puntos de venta ante cortes y variaciones electricas en Colombia.',
    seoKeywords: [
      'UPS Forza Colombia',
      'UPS interactivo Forza Cali',
      'regulador voltaje Forza',
      'protector corriente Forza',
      'UPS para oficina Colombia',
      'respaldo energia Colombia',
      'Forza Power Colombia',
      'UPS 1000VA Forza',
    ],
  },
  {
    name: 'TP-Link',
    slug: 'tp-link',
    logo: '/marcas_originales/TPLINK_Logo_2.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'Redes y WiFi',
    summary:
      'Routers, sistemas mesh, switches y conectividad para casa, oficina y negocio que necesitan una red mas estable.',
    salesAngle:
      'Suele ser de las marcas mas buscadas cuando el internet no cubre bien o hace falta ordenar la red del negocio.',
    useCases: ['Router principal', 'Cobertura WiFi', 'Switches y red local'],
    lineupTitle: 'Lo que mas piden de TP-Link',
    lineupCopy:
      'Routers, mesh y switches para mejorar cobertura, repartir mejor el ancho de banda y estabilizar la red.',
    focusTitle: 'Cuando el cliente quiere mas cobertura y mejor orden en red',
    accentClass: 'border-teal-200 bg-teal-50 text-teal-800',
    seoDescription:
      'TP-Link es una de las marcas de networking mas vendidas del mundo. En SUMITRONIC distribuimos routers WiFi 6, sistemas mesh Deco, switches administrables, access points y repetidores TP-Link para casa, oficina y empresas. Resuelve problemas de cobertura, velocidad y estabilidad de red con equipos de probada confiabilidad y soporte local en Cali, Colombia.',
    seoKeywords: [
      'router TP-Link Colombia',
      'sistema mesh Deco Colombia',
      'switch TP-Link Cali',
      'WiFi 6 TP-Link',
      'repetidor WiFi TP-Link',
      'access point TP-Link Colombia',
      'TP-Link router Colombia',
      'red WiFi hogar Colombia',
    ],
  },
  {
    name: 'Mercusys',
    slug: 'mercusys',
    logo: '/marcas_originales/mercusys-logo.png',
    carouselLogoClass: 'scale-100',
    panelLogoClass: 'scale-100',
    category: 'Conectividad accesible',
    summary:
      'Routers, repetidores, access points y switches pensados para resolver conectividad en casa o negocio pequeno.',
    salesAngle:
      'Encaja bien cuando hace falta mejorar el WiFi sin subir demasiado el presupuesto.',
    useCases: ['WiFi en casa', 'Repetidores', 'Router costo-beneficio'],
    lineupTitle: 'Lo que mas se vende de Mercusys',
    lineupCopy:
      'Routers y extensores para quien necesita mejor cobertura con una compra practica, clara y de buena relacion costo-beneficio.',
    focusTitle: 'Buena opcion para resolver WiFi con una inversion mas medida',
    accentClass: 'border-rose-200 bg-rose-50 text-rose-800',
    seoDescription:
      'Mercusys es la linea economica de TP-Link, disenada para ofrecer conectividad WiFi fiable a un precio accesible. En SUMITRONIC distribuimos routers, repetidores y access points Mercusys ideales para casas, apartamentos y negocios pequenos que necesitan mejorar la cobertura WiFi sin invertir demasiado. Disponibles con envio a todo Colombia desde Cali.',
    seoKeywords: [
      'router Mercusys Colombia',
      'repetidor WiFi Mercusys',
      'Mercusys Cali',
      'router economico Colombia',
      'WiFi accesible Colombia',
      'extensor WiFi Mercusys',
      'Mercusys router',
      'internet en casa Colombia',
    ],
  },
]

export function getBrandBySlug(slug: string): BrandProfile | undefined {
  return BRAND_PROFILES.find(b => b.slug === slug)
}
