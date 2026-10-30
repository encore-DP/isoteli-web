/**
 * ==========================================================================
 * CONSTANTES INSTITUCIONALES Y POLÍTICAS DE NEGOCIO - ISOTELI FLORERÍA
 * Fuente única de verdad (DRY) para textos corporativos, políticas de envío,
 * límites distritales en Arequipa y canales oficiales de atención.
 * ==========================================================================
 */

export interface BrandValue {
  readonly id: string;
  readonly title: string;
  readonly shortSubtitle: string;
  readonly description: string;
  readonly highlightBadge: string;
  readonly icon: string;
  readonly nosotrosIcon: string;
}

export interface DistrictBoundary {
  readonly name: string;
  readonly fullCoverage: boolean;
  readonly badge: string;
  readonly boundaryDetail: string;
  readonly shortBoundary: string;
}

export interface OccasionItem {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly circleBg: string;
  readonly message: string;
}

export const ISOTELI_CONTACT = {
  brandName: 'ISOTELI Flores y Detalles',
  shortName: 'ISOTELI',
  phoneRaw: '51904803219',
  phoneDisplay: '+51 904 803 219',
  phoneShort: '904 803 219',
  officeAddress: 'Urb. Santa María de Lambramani A15 – José Luis Bustamante y Rivero, Arequipa',
  officeShortAddress: 'Urb. Santa María de Lambramani A15 – J.L.B. y Rivero, Arequipa',
  googleMapsUrl:
    'https://maps.google.com/?q=Santa+Maria+de+Lambramani,Jose+Luis+Bustamante,Arequipa,Peru',
  virtualStoreNotice:
    'Al ser tienda virtual sin local físico para muestras y ventas, todo el proceso de asesoría y catálogo se realiza en línea con posibilidad de videollamadas personalizadas. Nuestra oficina exclusiva para coordinación y decoración de eventos se ubica en Urb. Santa María de Lambramani A15 – José Luis Bustamante y Rivero, Arequipa.',
  emails: {
    ventas: 'ventas@isoteli.com',
    eventos: 'eventos@isoteli.com',
    administracion: 'administracion@isoteli.com',
  },
  paymentMethods: ['Transferencia bancaria', 'Yape', 'Plin'] as const,
  schedule: {
    weekdays: 'Lun - Sáb: 8:00 AM - 8:00 PM',
    sundays: 'Dom: 9:00 AM - 3:00 PM',
    leadTime: 'Pedidos inmediatos (mínimo 1 hora, máximo 3 horas) según disponibilidad de movilidad.',
  },
  deliveryPolicy: {
    topBarText: 'Delivery Gratis a partir de compras mayores a S/99.90. Caso contrario: S/10',
    freeThreshold: 99.9,
    standardFee: 10,
    peripheralFee: 15,
    peripheralDistricts:
      'Sachaca, Tiabaya, Uchumayo, Hunter, Sabandía, Characato, Yura, Yarabamba y zonas más allá de los límites indicados en la cobertura estándar.',
  },
} as const;

export const ISOTELI_MISSION =
  'En Isoteli Flores y Detalles, tenemos como misión expresar emociones y crear momentos inolvidables a través de flores frescas, arreglos florales, detalles personalizados y decoración de eventos. Nos comprometemos a brindar productos de calidad a precios accesibles, ofreciendo una atención amable y personalizada, con creatividad y puntualidad en cada entrega, para satisfacer las necesidades y superar las expectativas de nuestros clientes en Arequipa, Perú.';

export const ISOTELI_VISION = {
  quote:
    '“Ser una florería reconocida en Arequipa y sus alrededores por la calidad, creatividad y elegancia de nuestros arreglos florales y detalles.”',
  body: 'Destacándonos por la atención personalizada y la confianza de nuestros clientes. Aspiramos a expandir nuestra presencia mediante las ventas por internet, llegando a más personas y consolidándonos como una marca innovadora y competitiva en el mercado floral, capaz de transmitir sentimientos y convertir cada ocasión especial en un recuerdo inolvidable.',
} as const;

export const ISOTELI_VALUES: readonly BrandValue[] = [
  {
    id: 'creatividad',
    title: 'Creatividad',
    shortSubtitle: 'Diseños florales únicos y vanguardistas',
    description:
      'Diseñamos arreglos florales y detalles originales que transmiten emociones y se adaptan a cada ocasión especial.',
    highlightBadge: 'Diseños originales',
    icon: 'palette',
    nosotrosIcon: 'brush',
  },
  {
    id: 'calidad',
    title: 'Calidad',
    shortSubtitle: 'Flores selectas de frescura garantizada',
    description:
      'Seleccionamos flores frescas y materiales adecuados para ofrecer productos atractivos y satisfactorios.',
    highlightBadge: 'Flores frescas seleccionadas',
    icon: 'potted_plant',
    nosotrosIcon: 'temp_preferences_custom',
  },
  {
    id: 'puntualidad',
    title: 'Puntualidad',
    shortSubtitle: 'Despachos en franja horaria exacta',
    description:
      'Cumplimos con los tiempos acordados para que cada detalle llegue en el momento indicado.',
    highlightBadge: 'Entregas a tiempo',
    icon: 'schedule',
    nosotrosIcon: 'schedule',
  },
  {
    id: 'amabilidad',
    title: 'Amabilidad',
    shortSubtitle: 'Atención cálida y personalizada en cada pedido',
    description:
      'Brindamos una atención cercana, respetuosa y personalizada, procurando que cada cliente disfrute de una experiencia especial.',
    highlightBadge: 'Atención personalizada',
    icon: 'sentiment_satisfied',
    nosotrosIcon: 'sentiment_satisfied',
  },
] as const;

export const AREQUIPA_DISTRICTS: readonly DistrictBoundary[] = [
  {
    name: 'Yanahuara',
    fullCoverage: true,
    badge: 'Cobertura Total',
    boundaryDetail: 'Sin límite distrital interno.',
    shortBoundary: 'Completo',
  },
  {
    name: 'Cayma',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Av. Bolognesi',
    shortBoundary: 'Límite: Av. Bolognesi',
  },
  {
    name: 'José Luis Bustamante y Rivero',
    fullCoverage: true,
    badge: 'Cobertura Total',
    boundaryDetail: 'Incluye Urb. Santa María de Lambramani A15.',
    shortBoundary: 'Completo',
  },
  {
    name: 'Alto Selva Alegre',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Piscina Padre José Schmidpeter ASA',
    shortBoundary: 'Límite: Piscina Padre José Schmidpeter ASA',
  },
  {
    name: 'Mariano Melgar',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Av. Argentina',
    shortBoundary: 'Límite: Av. Argentina',
  },
  {
    name: 'Paucarpata',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Parque Backus',
    shortBoundary: 'Límite: Parque Backus',
  },
  {
    name: 'Cerro Colorado',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Plaza las Américas',
    shortBoundary: 'Límite: Plaza las Américas',
  },
  {
    name: 'Miraflores',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Alto Misti',
    shortBoundary: 'Límite: Alto Misti',
  },
  {
    name: 'Socabaya',
    fullCoverage: false,
    badge: 'Con Límite',
    boundaryDetail: 'Comisaría Ciudad Mi Trabajo',
    shortBoundary: 'Límite: Comisaría Ciudad Mi Trabajo',
  },
] as const;

export const ISOTELI_OCCASIONS: readonly OccasionItem[] = [
  {
    title: 'Cumpleaños',
    subtitle: 'Alegría & Color',
    icon: 'cake',
    circleBg: 'bg-primary-fixed/60 group-hover:bg-primary-fixed text-primary',
    message: 'Hola ISOTELI, busco un arreglo para Cumpleaños',
  },
  {
    title: 'Aniversario',
    subtitle: 'Romance Puro',
    icon: 'favorite',
    circleBg: 'bg-[#fde3d6] group-hover:bg-[#fbd0bc] text-primary',
    message: 'Hola ISOTELI, busco un arreglo para Aniversario',
  },
  {
    title: 'Felicitaciones',
    subtitle: 'Logros & Grados',
    icon: 'workspace_premium',
    circleBg: 'bg-[#fcf0db] group-hover:bg-[#f8e2bc] text-primary',
    message: 'Hola ISOTELI, busco un arreglo de Felicitaciones o Grado',
  },
  {
    title: 'Agradecimiento',
    subtitle: 'Gratitud Sincera',
    icon: 'volunteer_activism',
    circleBg: 'bg-secondary-container group-hover:bg-secondary-fixed-dim/70 text-primary',
    message: 'Hola ISOTELI, busco un arreglo de Agradecimiento',
  },
  {
    title: 'Condolencias',
    subtitle: 'Paz & Memoria',
    icon: 'spa',
    circleBg: 'bg-surface-container-high group-hover:bg-surface-container-highest text-on-surface-variant',
    message: 'Hola ISOTELI, busco un arreglo de Condolencias o Fúnebre',
  },
  {
    title: 'Nuevo Bebé',
    subtitle: 'Tierna Llegada',
    icon: 'child_care',
    circleBg: 'bg-[#faebe1] group-hover:bg-[#f7d9c6] text-primary',
    message: 'Hola ISOTELI, busco un arreglo para Nacimiento o Baby Shower',
  },
] as const;

/**
 * Construye de forma segura una URL hacia el WhatsApp oficial de ISOTELI.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ISOTELI_CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
}

