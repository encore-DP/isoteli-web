/**
 * ==========================================================================
 * UTILIDADES DE SEO Y DATOS ESTRUCTURADOS (JSON-LD) PARA GOOGLE
 * Implementa esquemas Schema.org de Florist, LocalBusiness, WebSite,
 * Service, CollectionPage, ContactPage, BreadcrumbList y Product
 * orientados al posicionamiento local en Arequipa, Perú.
 * ==========================================================================
 */

import { ISOTELI_CONTACT } from '../data/business';
import type { CatalogProduct } from './wp-graphql';

export const SITE_URL = 'https://isoteli.com';
export const DEFAULT_OG_IMAGE = '/images/og-isoteli-arequipa.jpg';

function normalizePathUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const clean = pathOrUrl === '/' ? '/' : `${pathOrUrl.replace(/\/$/, '')}/`;
  return `${SITE_URL}${clean}`;
}

/**
 * Normaliza una URL de imagen para Schema/OpenGraph asegurando formato rasterizado
 * (evita .svg que Google Rich Results y WhatsApp rechazan).
 */
export function resolveSeoImageUrl(imageUrl?: string | null): string {
  if (!imageUrl || /\.svg(?:$|\?)/i.test(imageUrl)) {
    return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  }
  return imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
}

/**
 * Esquema principal de Florist / LocalBusiness para Arequipa, Perú.
 * Cumple con directrices oficiales de Google Search para resultados enriquecidos locales.
 */
export function getFloristSchema(): Record<string, any> {
  return {
    '@type': 'Florist',
    '@id': `${SITE_URL}/#florist`,
    name: ISOTELI_CONTACT.brandName,
    alternateName: [
      'ISOTELI Florería Arequipa',
      'Florería ISOTELI',
      'ISOTELI Flores & Detalles',
    ],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo-isoteli.png`,
    },
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description:
      'Florería virtual y servicio de decoración de eventos en Arequipa especializada en ramos de rosas, girasoles, cajas florales, globos con helio y regalos con entrega a domicilio el mismo día.',
    telephone: `+${ISOTELI_CONTACT.phoneRaw}`,
    email: ISOTELI_CONTACT.emails.ventas,
    priceRange: 'S/ 20 - S/ 500',
    currenciesAccepted: 'PEN',
    paymentAccepted: 'Efectivo, Transferencia bancaria, Tarjeta de Crédito/Débito, Yape, Plin',
    hasMap: ISOTELI_CONTACT.googleMapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Urb. Santa María de Lambramani A15',
      addressLocality: 'José Luis Bustamante y Rivero',
      addressRegion: 'Arequipa',
      postalCode: '04002',
      addressCountry: 'PE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -16.413809,
      longitude: -71.520988,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '15:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Arequipa' },
      { '@type': 'AdministrativeArea', name: 'José Luis Bustamante y Rivero' },
      { '@type': 'AdministrativeArea', name: 'Yanahuara' },
      { '@type': 'AdministrativeArea', name: 'Cayma' },
      { '@type': 'AdministrativeArea', name: 'Cercado de Arequipa' },
      { '@type': 'AdministrativeArea', name: 'Cerro Colorado' },
      { '@type': 'AdministrativeArea', name: 'Miraflores' },
      { '@type': 'AdministrativeArea', name: 'Alto Selva Alegre' },
      { '@type': 'AdministrativeArea', name: 'Mariano Melgar' },
      { '@type': 'AdministrativeArea', name: 'Paucarpata' },
      { '@type': 'AdministrativeArea', name: 'Socabaya' },
      { '@type': 'AdministrativeArea', name: 'Sachaca' },
      { '@type': 'AdministrativeArea', name: 'Tiabaya' },
      { '@type': 'AdministrativeArea', name: 'Hunter' },
      { '@type': 'AdministrativeArea', name: 'Sabandía' },
    ],
    sameAs: [
      'https://www.facebook.com/isoteli',
      'https://www.instagram.com/isoteli',
    ],
  };
}

/**
 * Esquema WebSite para habilitar SearchAction y branding del sitio.
 */
export function getWebSiteSchema(): Record<string, any> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'ISOTELI Florería & Decoración de Eventos Arequipa',
    publisher: { '@id': `${SITE_URL}/#florist` },
    inLanguage: 'es-PE',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalogo/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Esquema CollectionPage para el catálogo de florería y regalos en Arequipa.
 */
export function getCatalogPageSchema(totalProducts: number): Record<string, any> {
  return {
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/catalogo/#webpage`,
    url: `${SITE_URL}/catalogo/`,
    name: 'Catálogo de Flores, Ramos, Cajas y Regalos en Arequipa | ISOTELI',
    description: `Catálogo en línea de ${totalProducts} arreglos florales, ramos de rosas, girasoles, cajas florales y detalles a domicilio en Arequipa.`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#florist` },
    inLanguage: 'es-PE',
  };
}

/**
 * Esquema Service + OfferCatalog para la página de Decoración de Eventos en Arequipa.
 */
export function getEventsServiceSchema(): Record<string, any> {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/eventos/#service`,
    url: `${SITE_URL}/eventos/`,
    name: 'Decoración de Eventos con Globos y Flores en Arequipa',
    serviceType: 'Decoración de Eventos y Ambientación',
    provider: { '@id': `${SITE_URL}/#florist` },
    areaServed: {
      '@type': 'City',
      name: 'Arequipa',
    },
    description:
      'Servicio de decoración con globos, paneles temáticos, arreglos florales y ambientación en Arequipa para cumpleaños, bautizos, revelación de género, primera comunión y pedidas de mano.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Decoración de Eventos ISOTELI Arequipa',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración de Cumpleaños con Globos en Arequipa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración de Bautizos en Arequipa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración para Revelación de Género en Arequipa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración de Primera Comunión en Arequipa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración para Pedidas de Mano en Arequipa' } },
      ],
    },
  };
}

/**
 * Esquema ContactPage para pedidos y cobertura distrital en Arequipa.
 */
export function getContactPageSchema(): Record<string, any> {
  return {
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contacto/#webpage`,
    url: `${SITE_URL}/contacto/`,
    name: 'Contacto y Pedidos de Flores a Domicilio en Arequipa | ISOTELI',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#florist` },
    inLanguage: 'es-PE',
  };
}

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

/**
 * Esquema BreadcrumbList para migas de pan enriquecidas en Google SERP.
 */
export function getBreadcrumbSchema(crumbs: readonly BreadcrumbCrumb[]): Record<string, any> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: normalizePathUrl(crumb.path),
    })),
  };
}

/**
 * Esquema Product para páginas individuales.
 * Cumple políticas de Google: solo incluye aggregateRating cuando existen
 * reseñas reales verificadas (> 0) y evita imágenes SVG.
 */
export function getProductSchema(
  product: CatalogProduct,
  canonicalUrl: string,
  metaDescription?: string,
): Record<string, any> {
  const safeImg = resolveSeoImageUrl(product.imageUrl);

  const variationPrices = product.variations
    .map((v) => v.numericPrice)
    .filter((p) => typeof p === 'number' && Number.isFinite(p) && p > 0);
  const hasMultiplePrices =
    product.productType === 'variable' &&
    variationPrices.length > 1 &&
    Math.max(...variationPrices) > Math.min(...variationPrices);

  const baseShipping = {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: product.numericPrice >= 99.9 ? 0 : 10,
      currency: 'PEN',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'PE',
      addressRegion: 'Arequipa',
    },
  };

  const returnPolicy = {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'PE',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 1,
    returnMethod: 'https://schema.org/ReturnInStore',
  };

  const offers = hasMultiplePrices
    ? {
        '@type': 'AggregateOffer',
        url: canonicalUrl,
        priceCurrency: 'PEN',
        lowPrice: Math.min(...variationPrices),
        highPrice: Math.max(...variationPrices),
        offerCount: product.variations.length,
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${SITE_URL}/#florist` },
      }
    : {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'PEN',
        price: product.numericPrice,
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${SITE_URL}/#florist` },
        hasMerchantReturnPolicy: returnPolicy,
        shippingDetails: baseShipping,
      };

  const schema: Record<string, any> = {
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: `${product.name} en Arequipa`,
    image: [safeImg],
    description:
      metaDescription ||
      product.shortDescription ||
      `${product.name} con entrega a domicilio en Arequipa por ISOTELI Flores y Detalles.`,
    sku: product.slug,
    category: product.categoryLabel,
    brand: {
      '@type': 'Brand',
      name: 'ISOTELI',
    },
    offers,
  };

  if (product.reviewCount > 0 && product.rating > 0 && !product.id.startsWith('fb-')) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}
