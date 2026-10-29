/**
 * ==========================================================================
 * SERVICIO CENTRALIZADO HEADLESS WORDPRESS + WOOCOMMERCE (WPGraphQL)
 * Gestiona las consultas tipadas de productos florales, paquetes de decoración
 * y alquiler de mobiliario hacia import.meta.env.WORDPRESS_API_URL con
 * respaldo automático por categoría basado en Google Stitch.
 * ==========================================================================
 */

import {
  FALLBACK_CATALOG_PRODUCTS,
  FALLBACK_DECORATION_PACKS,
  FALLBACK_FURNITURE_RENTALS,
  FLORIST_CATEGORIES,
  PLACEHOLDER_IMAGE,
} from '../data/fallback-store';

/* ================= TIPOS DE DOMINIO NORMALIZADOS ================= */

export type FloristCategorySlug =
  | 'ramos-y-buchones'
  | 'cajas-y-boxes'
  | 'globos-y-bouquets'
  | 'chocolates'
  | 'peluches-y-detalles';

export type DecorationLineSlug = 'linea-clasica' | 'linea-tematica-infantil';

export interface ProductVariationOption {
  readonly id: string;
  readonly label: string;
  readonly subtitle?: string;
  readonly formattedPrice: string;
  readonly numericPrice: number;
  readonly badge?: string;
}

export interface CatalogProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly productType: 'simple' | 'variable';
  readonly categorySlug: FloristCategorySlug;
  readonly categoryLabel: string;
  readonly badge?: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly botanicalItems?: readonly string[];
  readonly dimensions?: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly gallery: readonly { readonly url: string; readonly alt: string }[];
  readonly formattedPrice: string;
  readonly numericPrice: number;
  readonly pricePrefix?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly popularity: number;
  readonly featuredOnHome?: 'collection' | 'bestseller' | 'both';
  readonly variations: readonly ProductVariationOption[];
}

export interface ServicePack {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly lineSlug: DecorationLineSlug;
  readonly lineLabel: string;
  readonly topBadge: string;
  readonly backingSize: string;
  readonly formattedPrice: string;
  readonly numericPrice: number;
  readonly shortDescription: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly ctaLabel: string;
  readonly variant:
    | 'standard'
    | 'popular'
    | 'deluxe-classic'
    | 'thematic-gold'
    | 'thematic-petit'
    | 'panoramic';
  readonly gridColClass: string;
}

export interface FurnitureRental {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly formattedPrice: string;
  readonly numericPrice: number;
  readonly unitSuffix?: string;
}

/* ================= CONTRATOS CRUDOS WPGRAPHQL / WOOCOMMERCE ================= */

interface WPImageNode {
  readonly sourceUrl?: string | null;
  readonly altText?: string | null;
}

interface WPCategoryNode {
  readonly slug: string;
  readonly name: string;
}

interface WPVariationAttributeNode {
  readonly name: string;
  readonly label?: string | null;
  readonly value: string;
}

interface WPVariationNode {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly price?: string | null;
  readonly rawPrice?: string | null;
  readonly attributes?: {
    readonly nodes: readonly WPVariationAttributeNode[];
  } | null;
}

interface WPBaseProductNode {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription?: string | null;
  readonly description?: string | null;
  readonly featured?: boolean | null;
  readonly averageRating?: number | null;
  readonly reviewCount?: number | null;
  readonly image?: WPImageNode | null;
  readonly galleryImages?: {
    readonly nodes: readonly WPImageNode[];
  } | null;
  readonly productCategories?: {
    readonly nodes: readonly WPCategoryNode[];
  } | null;
}

interface WPSimpleProductNode extends WPBaseProductNode {
  readonly __typename: 'SimpleProduct';
  readonly price?: string | null;
  readonly rawPrice?: string | null;
}

interface WPVariableProductNode extends WPBaseProductNode {
  readonly __typename: 'VariableProduct';
  readonly price?: string | null;
  readonly rawPrice?: string | null;
  readonly variations?: {
    readonly nodes: readonly WPVariationNode[];
  } | null;
}

type WPProductNode = WPSimpleProductNode | WPVariableProductNode;

interface WPProductsQueryResponse {
  readonly products?: {
    readonly nodes: readonly WPProductNode[];
  } | null;
}

interface GraphQLEnvelope<T> {
  readonly data?: T;
  readonly errors?: readonly { readonly message: string }[];
}

/* ================= CONSTANTES DE CONSULTA Y ALIAS DE SLUGS ================= */

export const FLORIST_CATEGORY_SLUGS: readonly FloristCategorySlug[] = FLORIST_CATEGORIES.map(
  (c) => c.slug
);

/**
 * Mapeo bidireccional de slugs reales creados en WooCommerce (ej. 'boxes',
 * 'ramos-buchones') y los slugs canónicos definidos en la arquitectura.
 */
const FLORIST_CATEGORY_ALIAS_MAP: Readonly<Record<string, FloristCategorySlug>> = {
  'ramos-y-buchones': 'ramos-y-buchones',
  'ramos-buchones': 'ramos-y-buchones',
  ramos: 'ramos-y-buchones',
  'cajas-y-boxes': 'cajas-y-boxes',
  'cajas-boxes': 'cajas-y-boxes',
  boxes: 'cajas-y-boxes',
  cajas: 'cajas-y-boxes',
  'globos-y-bouquets': 'globos-y-bouquets',
  'globos-bouquets': 'globos-y-bouquets',
  globos: 'globos-y-bouquets',
  chocolates: 'chocolates',
  'peluches-y-detalles': 'peluches-y-detalles',
  'peluches-detalles': 'peluches-y-detalles',
  peluches: 'peluches-y-detalles',
};

export const FLORIST_QUERY_CATEGORY_SLUGS = [
  ...Object.keys(FLORIST_CATEGORY_ALIAS_MAP),
  'floreria-y-regalos',
] as const;

export const DECORATION_CATEGORY_SLUGS = [
  'servicios-decoracion',
  'servicio-de-decoracion',
  'servicios-de-decoracion',
  'linea-clasica',
  'linea-tematica-infantil',
  'linea-tematica',
] as const;

export const RENTAL_CATEGORY_SLUGS = [
  'alquiler-de-mobiliario',
  'alquiler-mobiliario',
] as const;

const PRODUCTS_BY_CATEGORY_QUERY = /* GraphQL */ `
  query ObtenerProductosPorCategorias($categorySlugs: [String]!, $first: Int = 60) {
    products(first: $first, where: { categoryIn: $categorySlugs, status: "publish" }) {
      nodes {
        __typename
        id
        slug
        name
        shortDescription
        description
        featured
        averageRating
        reviewCount
        image {
          sourceUrl
          altText
        }
        galleryImages(first: 6) {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            slug
            name
          }
        }
        ... on SimpleProduct {
          price(format: FORMATTED)
          rawPrice: price(format: RAW)
        }
        ... on VariableProduct {
          price(format: FORMATTED)
          rawPrice: price(format: RAW)
          variations(first: 20) {
            nodes {
              id
              name
              description
              price(format: FORMATTED)
              rawPrice: price(format: RAW)
              attributes {
                nodes {
                  name
                  label
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ================= UTILIDADES DE SANITIZACIÓN Y PARSEO ================= */

/**
 * Elimina etiquetas HTML y entidades comunes devueltas por WooCommerce
 * (por ejemplo &nbsp;, &#83;&#47; o párrafos <p> en shortDescription).
 */
export function stripHtmlAndDecode(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#83;&#47;|&#83;\/|S&#47;/gi, 'S/')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrae el valor numérico mínimo de un precio crudo o formateado de WooCommerce.
 */
export function parseNumericPrice(rawOrFormatted?: string | null): number {
  if (!rawOrFormatted) return 0;
  const cleaned = stripHtmlAndDecode(rawOrFormatted);
  const match = cleaned.match(/(\d+(?:[.,]\d+)?)/);
  if (!match || !match[1]) return 0;
  const parsed = Number.parseFloat(match[1].replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Normaliza un precio al formato peruano S/ XX.XX.
 */
export function formatPenPrice(numeric: number, fallbackFormatted?: string | null): string {
  if (numeric > 0) {
    return `S/ ${numeric.toFixed(2)}`;
  }
  const cleaned = stripHtmlAndDecode(fallbackFormatted);
  return cleaned || 'Consultar';
}

/**
 * Ejecuta una consulta POST hacia el endpoint WPGraphQL configurado en entorno.
 * Incluye timeout preventivo para no bloquear compilaciones si el CMS está en mantenimiento.
 */
async function fetchWPGraphQL<TData>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<TData | null> {
  const endpoint =
    import.meta.env.PUBLIC_WORDPRESS_API_URL ||
    import.meta.env.WORDPRESS_API_URL ||
    'https://cms.isoteli.com/graphql';

  if (!endpoint || typeof endpoint !== 'string') {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(5500),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as GraphQLEnvelope<TData>;
    if (payload.errors?.length || !payload.data) {
      return null;
    }

    return payload.data;
  } catch {
    // Silencioso en desarrollo/build cuando el servidor WPGraphQL aún no está en línea
    return null;
  }
}

/* ================= MAPEADORES DE PRODUCTOS, PACKS Y MOBILIARIO ================= */

function resolveFloristCategory(
  categories: readonly WPCategoryNode[],
  productName: string
): { slug: FloristCategorySlug; label: string } {
  for (const cat of categories) {
    const mappedSlug = FLORIST_CATEGORY_ALIAS_MAP[cat.slug.toLowerCase()];
    if (mappedSlug) {
      const canonical = FLORIST_CATEGORIES.find((fc) => fc.slug === mappedSlug);
      return {
        slug: mappedSlug,
        label: canonical?.label ?? (cat.name || 'Arreglo Floral'),
      };
    }
  }

  // Si solo tiene asignada la categoría padre 'floreria-y-regalos', inferimos subcategoría por nombre
  const lower = productName.toLowerCase();
  if (/box|caja|sombrerera/.test(lower)) {
    return { slug: 'cajas-y-boxes', label: 'Cajas & Boxes' };
  }
  if (/globo|bouquet|helio|burbuja/.test(lower)) {
    return { slug: 'globos-y-bouquets', label: 'Globos & Bouquets' };
  }
  if (/chocolate|ib[eé]rica|ferrero|bomb[oó]n|trufa/.test(lower)) {
    return { slug: 'chocolates', label: 'Chocolates' };
  }
  if (/peluche|oso|osito|detalle/.test(lower)) {
    return { slug: 'peluches-y-detalles', label: 'Peluches & Detalles' };
  }

  return { slug: 'ramos-y-buchones', label: 'Ramos & Buchones' };
}

function mapWPProductToCatalog(node: WPProductNode, index: number): CatalogProduct {
  const categories = node.productCategories?.nodes ?? [];
  const resolvedCat = resolveFloristCategory(categories, node.name);

  const isVariable = node.__typename === 'VariableProduct';
  const rawVariations = isVariable ? (node.variations?.nodes ?? []) : [];

  const variations: ProductVariationOption[] = rawVariations.map((variation) => {
    const attrLabel =
      variation.attributes?.nodes.map((a) => a.value).join(' • ') ||
      stripHtmlAndDecode(variation.name).replace(node.name, '').replace(/^[-–\s]+/, '') ||
      variation.name;
    const varNumeric = parseNumericPrice(variation.rawPrice ?? variation.price);

    return {
      id: variation.id,
      label: attrLabel,
      subtitle: stripHtmlAndDecode(variation.description) || undefined,
      formattedPrice: formatPenPrice(varNumeric, variation.price),
      numericPrice: varNumeric,
    };
  });

  const baseNumeric =
    variations.length > 0
      ? Math.min(...variations.map((v) => v.numericPrice).filter((n) => n > 0))
      : parseNumericPrice(node.rawPrice ?? node.price);

  const hasRange =
    variations.length > 1 &&
    new Set(variations.map((v) => v.numericPrice).filter((n) => n > 0)).size > 1;

  const primaryImage = node.image?.sourceUrl || PLACEHOLDER_IMAGE;
  const primaryAlt =
    stripHtmlAndDecode(node.image?.altText) || `${node.name} - ISOTELI Florería Arequipa`;

  const gallery = (node.galleryImages?.nodes ?? [])
    .filter((img): img is { sourceUrl: string; altText?: string | null } => Boolean(img.sourceUrl))
    .map((img) => ({
      url: img.sourceUrl,
      alt: stripHtmlAndDecode(img.altText) || node.name,
    }));

  const cleanShortDesc =
    stripHtmlAndDecode(node.shortDescription) ||
    stripHtmlAndDecode(node.description) ||
    'Arreglo floral fresco preparado artesanalmente en Arequipa con tarjeta caligrafiada incluida.';

  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    productType: isVariable && variations.length > 0 ? 'variable' : 'simple',
    categorySlug: resolvedCat.slug,
    categoryLabel: resolvedCat.label,
    badge: node.featured ? 'Destacado' : undefined,
    shortDescription: cleanShortDesc,
    fullDescription: stripHtmlAndDecode(node.description) || cleanShortDesc,
    imageUrl: primaryImage,
    imageAlt: primaryAlt,
    gallery: gallery.length > 0 ? gallery : [{ url: primaryImage, alt: primaryAlt }],
    formattedPrice: formatPenPrice(baseNumeric, node.price),
    numericPrice: baseNumeric,
    pricePrefix: hasRange ? 'Desde' : undefined,
    rating: node.averageRating && node.averageRating > 0 ? node.averageRating : 5.0,
    reviewCount: node.reviewCount && node.reviewCount > 0 ? node.reviewCount : 24 + index * 5,
    popularity: node.featured ? 98 : Math.max(75, 95 - index * 2),
    variations,
  };
}

function inferBackingSize(text: string, numericPrice: number): string {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m\b|metros?)/i);
  if (match && match[1]) {
    return `Backing ${match[1].replace(',', '.')} m`;
  }
  if (numericPrice <= 250 && text.toLowerCase().includes('petit')) return 'Backing 1.5 m';
  if (numericPrice >= 480) return 'Backing 3 m';
  return 'Backing 2.5 m';
}

function mapWPProductToServicePack(node: WPProductNode, index: number): ServicePack {
  const categories = node.productCategories?.nodes ?? [];
  const isThematic = categories.some((c) => c.slug === 'linea-tematica-infantil') ||
    /tem[aá]tic|infantil|baby/i.test(node.name);

  const lineSlug: DecorationLineSlug = isThematic ? 'linea-tematica-infantil' : 'linea-clasica';
  const numericPrice = parseNumericPrice(node.rawPrice ?? node.price);
  const cleanDesc =
    stripHtmlAndDecode(node.shortDescription) ||
    stripHtmlAndDecode(node.description) ||
    'Incluye backing personalizado, mobiliario completo y accesorios decorativos.';
  const backingSize = inferBackingSize(`${node.name} ${cleanDesc}`, numericPrice);

  // Asignación de variante estética acorde al sistema collage de Stitch
  const lowerName = node.name.toLowerCase();
  let variant: ServicePack['variant'] = 'standard';
  let gridColClass = 'md:col-span-4';
  let topBadge = isThematic ? 'Temático • Infantil / Baby' : 'Línea Clásica';

  if (!isThematic && lowerName.includes('petit')) {
    variant = 'standard';
    gridColClass = 'md:col-span-3';
    topBadge = 'Línea Clásica';
  } else if (!isThematic && (lowerName.includes('gold') || node.featured)) {
    variant = 'popular';
    gridColClass = 'md:col-span-5';
    topBadge = 'Más Popular';
  } else if (!isThematic && lowerName.includes('deluxe')) {
    variant = 'deluxe-classic';
    gridColClass = 'md:col-span-4';
    topBadge = 'Gran Escala';
  } else if (isThematic && lowerName.includes('gold')) {
    variant = 'thematic-gold';
    gridColClass = 'md:col-span-7';
    topBadge = 'Temático • Infantil / Baby';
  } else if (isThematic && lowerName.includes('petit')) {
    variant = 'thematic-petit';
    gridColClass = 'md:col-span-5';
    topBadge = 'Infantil';
  } else if (isThematic && lowerName.includes('deluxe')) {
    variant = 'panoramic';
    gridColClass = 'md:col-span-12';
    topBadge = 'Completo • Gran Formato';
  } else {
    gridColClass = index % 2 === 0 ? 'md:col-span-6' : 'md:col-span-6';
  }

  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    lineSlug,
    lineLabel: isThematic ? 'Línea Temática Infantil / Baby' : 'Línea Clásica Adultos & Juvenil',
    topBadge,
    backingSize,
    formattedPrice: formatPenPrice(numericPrice, node.price),
    numericPrice,
    shortDescription: cleanDesc,
    imageUrl: node.image?.sourceUrl || PLACEHOLDER_IMAGE,
    imageAlt: stripHtmlAndDecode(node.image?.altText) || `${node.name} - Decoración ISOTELI Arequipa`,
    ctaLabel: `Reservar ${node.name.replace(/^Pack\s+/i, '')}`,
    variant,
    gridColClass,
  };
}

function inferRentalIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('lluvia') || n.includes('luces')) return 'light_mode';
  if (n.includes('cubo')) return 'view_in_ar';
  if (n.includes('pirámide') || n.includes('piramide')) return 'change_history';
  if (n.includes('estructura') || n.includes('arco') || n.includes('puerta')) return 'sensor_door';
  if (n.includes('led') || n.includes('frase') || n.includes('neón')) return 'wb_twilight';
  if (n.includes('reloj')) return 'hourglass_bottom';
  if (n.includes('cilindro')) return 'view_column';
  if (n.includes('tiffany')) return 'chair_alt';
  if (n.includes('metálica') || n.includes('metalica') || n.includes('plateada')) return 'event_seat';
  if (n.includes('silla')) return 'chair';
  return 'table_restaurant';
}

function mapWPProductToRental(node: WPProductNode): FurnitureRental {
  const numericPrice = parseNumericPrice(node.rawPrice ?? node.price);
  const subtitle =
    stripHtmlAndDecode(node.shortDescription) ||
    stripHtmlAndDecode(node.description) ||
    'Disponible para alquiler por evento';
  const isPerUnit = /silla|unidad|c\/u/i.test(`${node.name} ${subtitle}`);

  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    subtitle,
    icon: inferRentalIcon(node.name),
    formattedPrice: formatPenPrice(numericPrice, node.price),
    numericPrice,
    unitSuffix: isPerUnit ? 'c/u' : undefined,
  };
}

/* ================= API PÚBLICA DE CONSULTA CON FALLBACK INTELIGENTE ================= */

/**
 * Ajusta el ancho de columnas en el mosaico de 12 columnas cuando WordPress
 * devuelve solo 1 o 2 paquetes en una línea, evitando tarjetas estrechas aisladas.
 */
function normalizePackGridSpans(packs: readonly ServicePack[]): ServicePack[] {
  const nonPanoramic = packs.filter((p) => p.variant !== 'panoramic');
  if (nonPanoramic.length === 1) {
    return packs.map((p) =>
      p.variant === 'panoramic' ? p : { ...p, gridColClass: 'md:col-span-6 lg:col-span-5' }
    );
  }
  if (nonPanoramic.length === 2) {
    return packs.map((p) =>
      p.variant === 'panoramic' ? p : { ...p, gridColClass: 'md:col-span-6' }
    );
  }
  return [...packs];
}

/**
 * Obtiene el catálogo floral completo desde WooCommerce filtrando las 5 categorías
 * oficiales y sus alias reales en WordPress. Si alguna categoría aún no tiene productos
 * publicados, se completa con los productos de respaldo de Stitch para esa categoría.
 */
export async function getCatalogProducts(): Promise<{
  products: CatalogProduct[];
  source: 'wordpress' | 'hybrid' | 'fallback';
}> {
  const data = await fetchWPGraphQL<WPProductsQueryResponse>(PRODUCTS_BY_CATEGORY_QUERY, {
    categorySlugs: [...FLORIST_QUERY_CATEGORY_SLUGS],
    first: 60,
  });

  const wpNodes = data?.products?.nodes ?? [];
  if (wpNodes.length === 0) {
    return { products: [...FALLBACK_CATALOG_PRODUCTS], source: 'fallback' };
  }

  const mappedWp = wpNodes.map((node, idx) => mapWPProductToCatalog(node, idx));
  const merged: CatalogProduct[] = [...mappedWp];
  const seenSlugs = new Set(mappedWp.map((p) => p.slug));
  let usedFallback = false;

  for (const catSlug of FLORIST_CATEGORY_SLUGS) {
    const hasWpCategoryItems = mappedWp.some((p) => p.categorySlug === catSlug);
    if (!hasWpCategoryItems) {
      const fallbackForCat = FALLBACK_CATALOG_PRODUCTS.filter(
        (p) => p.categorySlug === catSlug && !seenSlugs.has(p.slug)
      );
      for (const item of fallbackForCat) {
        seenSlugs.add(item.slug);
        merged.push(item);
      }
      if (fallbackForCat.length > 0) usedFallback = true;
    }
  }

  return {
    products: merged,
    source: usedFallback ? 'hybrid' : 'wordpress',
  };
}

/**
 * Obtiene un producto específico por su slug junto con sugerencias relacionadas.
 */
export async function getProductBySlug(slug: string): Promise<{
  product: CatalogProduct;
  related: CatalogProduct[];
}> {
  const { products } = await getCatalogProducts();
  const product =
    products.find((p) => p.slug === slug) ??
    products[0] ??
    FALLBACK_CATALOG_PRODUCTS[0]!;

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  return { product, related };
}

/**
 * Obtiene los Paquetes de Decoración (servicios-decoracion / servicio-de-decoracion:
 * linea-clasica y linea-tematica-infantil) y el Alquiler de Mobiliario en paralelo,
 * aplicando datos de respaldo únicamente en las categorías que sigan vacías.
 */
export async function getServicesAndRentals(): Promise<{
  classicPacks: ServicePack[];
  thematicPacks: ServicePack[];
  allPacks: ServicePack[];
  rentals: FurnitureRental[];
  source: 'wordpress' | 'hybrid' | 'fallback';
}> {
  const [packsData, rentalsData] = await Promise.all([
    fetchWPGraphQL<WPProductsQueryResponse>(PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlugs: [...DECORATION_CATEGORY_SLUGS],
      first: 30,
    }),
    fetchWPGraphQL<WPProductsQueryResponse>(PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlugs: [...RENTAL_CATEGORY_SLUGS],
      first: 40,
    }),
  ]);

  const wpPackNodes = packsData?.products?.nodes ?? [];
  const wpRentalNodes = rentalsData?.products?.nodes ?? [];

  const mappedPacks = wpPackNodes.map((node, idx) => mapWPProductToServicePack(node, idx));
  const wpClassic = mappedPacks.filter((p) => p.lineSlug === 'linea-clasica');
  const wpThematic = mappedPacks.filter((p) => p.lineSlug === 'linea-tematica-infantil');

  const classicPacks = normalizePackGridSpans(
    wpClassic.length > 0
      ? wpClassic
      : FALLBACK_DECORATION_PACKS.filter((p) => p.lineSlug === 'linea-clasica')
  );

  const thematicPacks = normalizePackGridSpans(
    wpThematic.length > 0
      ? wpThematic
      : FALLBACK_DECORATION_PACKS.filter((p) => p.lineSlug === 'linea-tematica-infantil')
  );

  const rentals =
    wpRentalNodes.length > 0
      ? wpRentalNodes.map((node) => mapWPProductToRental(node))
      : [...FALLBACK_FURNITURE_RENTALS];

  const allFromWp = wpClassic.length > 0 && wpThematic.length > 0 && wpRentalNodes.length > 0;
  const noneFromWp = wpPackNodes.length === 0 && wpRentalNodes.length === 0;

  return {
    classicPacks,
    thematicPacks,
    allPacks: [...classicPacks, ...thematicPacks],
    rentals,
    source: noneFromWp ? 'fallback' : allFromWp ? 'wordpress' : 'hybrid',
  };
}

