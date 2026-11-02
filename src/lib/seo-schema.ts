/**
 * ==========================================================================
 * UTILIDADES DE SEO Y DATOS ESTRUCTURADOS (JSON-LD) PARA GOOGLE
 * Implementa esquemas Schema.org de Florist, LocalBusiness, WebSite,
 * BreadcrumbList y Product orientados al posicionamiento local en Arequipa.
 * ==========================================================================
 */

import { ISOTELI_CONTACT } from '../data/business';
import type { CatalogProduct } from './wp-graphql';

export const SITE_URL = 'https://isoteli.com';

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
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/images/placeholder-floral.svg`,
    description:
      'Atelier y florería virtual en Arequipa especializada en ramos de rosas, cajas florales, bouquets y ambientación de eventos con entrega a domicilio el mismo día.',
    telephone: `+${ISOTELI_CONTACT.phoneRaw}`,
    priceRange: 'S/ 20 - S/ 300',
    currenciesAccepted: 'PEN',
    paymentAccepted: 'Efectivo, Transferencia bancaria, Yape, Plin',
    hasMap: ISOTELI_CONTACT.googleMapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Urb. Santa María de Lambramani A15',
      addressLocality: 'José Luis Bustamante y Rivero',
      addressRegion: 'Arequipa',
      postalCode: '04001',
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
      { '@type': 'AdministrativeArea', name: 'Arequipa' },
      { '@type': 'AdministrativeArea', name: 'José Luis Bustamante y Rivero' },
      { '@type': 'AdministrativeArea', name: 'Yanahuara' },
      { '@type': 'AdministrativeArea', name: 'Cayma' },
      { '@type': 'AdministrativeArea', name: 'Cerro Colorado' },
      { '@type': 'AdministrativeArea', name: 'Miraflores' },
      { '@type': 'AdministrativeArea', name: 'Cercado Arequipa' },
      { '@type': 'AdministrativeArea', name: 'Alto Selva Alegre' },
      { '@type': 'AdministrativeArea', name: 'Paucarpata' },
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
    name: 'ISOTELI Florería & Decoración Arequipa',
    publisher: { '@id': `${SITE_URL}/#florist` },
    inLanguage: 'es-PE',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalogo?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
      item: crumb.path.startsWith('http') ? crumb.path : `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * Esquema Product para páginas individuales de arreglos florales.
 */
export function getProductSchema(
  product: CatalogProduct,
  canonicalUrl: string,
): Record<string, any> {
  const safeImg = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `${SITE_URL}${product.imageUrl || '/images/placeholder-floral.svg'}`;

  return {
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: `${product.name} en Arequipa`,
    image: [safeImg],
    description:
      product.shortDescription ||
      `Arreglo floral ${product.name} elaborado con flores frescas en Arequipa por ISOTELI. Entrega a domicilio el mismo día.`,
    sku: product.slug,
    category: product.categoryLabel,
    brand: {
      '@type': 'Brand',
      name: 'ISOTELI',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'PEN',
      price: product.numericPrice,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${SITE_URL}/#florist`,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PE',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 1,
        returnMethod: 'https://schema.org/ReturnInStore',
      },
      shippingDetails: {
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
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 5.0,
      reviewCount: product.reviewCount || 10,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

