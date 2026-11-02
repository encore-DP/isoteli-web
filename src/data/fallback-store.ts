/**
 * ==========================================================================
 * DATOS LOCALES REALES DE RESPALDO - ISOTELI
 * Contiene únicamente los productos, paquetes y mobiliario REALES de WooCommerce,
 * sin productos de relleno ni elementos ficticios.
 * ==========================================================================
 */

import type {
  CatalogProduct,
  FloristCategorySlug,
  FurnitureRental,
  ServicePack,
} from '../lib/wp-graphql';

export const PLACEHOLDER_IMAGE = '/images/producto_sin_foto.svg';

export const FLORIST_CATEGORIES: readonly {
  readonly slug: FloristCategorySlug;
  readonly label: string;
  readonly shortLabel: string;
}[] = [
  { slug: 'ramos-y-buchones', label: 'Ramos de Flores & Buchones', shortLabel: 'Ramos de Flores' },
  { slug: 'cajas-y-boxes', label: 'Cajas & Boxes ISOTELI', shortLabel: 'Cajas Isoteli' },
  { slug: 'globos-y-bouquets', label: 'Globos & Bouquets', shortLabel: 'Globos Personalizados' },
];

export const FALLBACK_CATALOG_PRODUCTS: readonly CatalogProduct[] = [
  {
    "id": "cG9zdDoyNA==",
    "slug": "rosas",
    "name": "Rosas",
    "productType": "simple",
    "categorySlug": "ramos-y-buchones",
    "categoryLabel": "Ramos de Flores & Buchones",
    "shortDescription": "Ramo de rosas del color que desees, acompañado de follaje y envuelto en papel floral",
    "fullDescription": "Ramo de rosas del color que desees, acompañado de follaje y envuelto en papel floral",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Rosas - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "Rosas - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 20.00",
    "numericPrice": 20.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "both",
    "variations": []
  },
  {
    "id": "cG9zdDoyOQ==",
    "slug": "parante-de-globo-burbuja",
    "name": "PARANTE DE GLOBO BURBUJA",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "MODELO ENCAPSULADO",
    "fullDescription": "MODELO ENCAPSULADO",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "PARANTE DE GLOBO BURBUJA - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "PARANTE DE GLOBO BURBUJA - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 20.00",
    "numericPrice": 20.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "both",
    "variations": []
  },
  {
    "id": "cG9zdDoyOA==",
    "slug": "modelo-encapsulado",
    "name": "MODELO ENCAPSULADO",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "MODELO ENCAPSULADO",
    "fullDescription": "MODELO ENCAPSULADO",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "MODELO ENCAPSULADO - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "MODELO ENCAPSULADO - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 100.00",
    "numericPrice": 100.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "both",
    "variations": []
  },
  {
    "id": "cG9zdDoyNw==",
    "slug": "modelo-clasico",
    "name": "MODELO CLÁSICO",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "MODELO CLÁSICO",
    "fullDescription": "MODELO CLÁSICO",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "MODELO CLÁSICO - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "MODELO CLÁSICO - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 12.00",
    "numericPrice": 12.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "both",
    "variations": []
  },
  {
    "id": "cG9zdDoyNQ==",
    "slug": "girasoles",
    "name": "Caja Isoteli con Rosas",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Este producto combina la delicadeza de las flores frescas con la presentación sofisticada de una caja, creando un regalo perfecto para expresar amor, gratitud o admiración.",
    "fullDescription": "Este producto combina la delicadeza de las flores frescas con la presentación sofisticada de una caja, creando un regalo perfecto para expresar amor, gratitud o admiración.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Caja Isoteli con Rosas - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "Caja Isoteli con Rosas - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 45.00",
    "numericPrice": 45.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "collection",
    "variations": []
  },
  {
    "id": "cG9zdDoyNg==",
    "slug": "caja-isoteli-con-girasoles",
    "name": "Caja Isoteli con Girasoles",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Este producto combina la frescura y el color vibrante de los girasoles con la presentación elegante de una caja, creando un obsequio que ilumina cualquier ocasión.",
    "fullDescription": "Este producto combina la frescura y el color vibrante de los girasoles con la presentación elegante de una caja, creando un obsequio que ilumina cualquier ocasión.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Caja Isoteli con Girasoles - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "Caja Isoteli con Girasoles - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 45.00",
    "numericPrice": 45.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "collection",
    "variations": []
  },
  {
    "id": "cG9zdDoyMw==",
    "slug": "box-vibrante",
    "name": "Box Vibrante",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Perfecto para celebrar cualquier ocasión o iluminar cualquier espacio",
    "fullDescription": "Perfecto para celebrar cualquier ocasión o iluminar cualquier espacio",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Box Vibrante - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "Box Vibrante - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 75.00",
    "numericPrice": 75.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "collection",
    "variations": []
  },
  {
    "id": "cG9zdDoyMg==",
    "slug": "box-rayo-del-sol",
    "name": "Box Rayo del Sol",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Ilumina cualquier ocasión con nuestro box de girasoles",
    "fullDescription": "Ilumina cualquier ocasión con nuestro box de girasoles",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Box Rayo del Sol - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "Box Rayo del Sol - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 50.00",
    "numericPrice": 50.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": "collection",
    "variations": []
  },
  {
    "id": "cG9zdDoxNg==",
    "slug": "box-clasico-capullo",
    "name": "Box Clásico Capullo",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Box de 50 rosas y eucalipto chino de elegancia",
    "fullDescription": "Box de 50 rosas y eucalipto chino de elegancia",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "https://cms.isoteli.com/wp-content/uploads/2026/10/box-rosas.jpg",
    "imageAlt": "Box Clásico Capullo - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "https://cms.isoteli.com/wp-content/uploads/2026/10/box-rosas.jpg",
        "alt": "Box Clásico Capullo - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 210.00",
    "numericPrice": 210.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  },
  {
    "id": "cG9zdDoyMQ==",
    "slug": "box-clasico",
    "name": "Box Clásico",
    "productType": "simple",
    "categorySlug": "cajas-y-boxes",
    "categoryLabel": "Cajas & Boxes ISOTELI",
    "shortDescription": "Perfecto para expresar amor, gratitud o celebración, su diseño moderno y delicado lo hace ideal para ocasiones especiales como aniversarios, cumpleaños o eventos importantes.",
    "fullDescription": "Perfecto para expresar amor, gratitud o celebración, su diseño moderno y delicado lo hace ideal para ocasiones especiales como aniversarios, cumpleaños o eventos importantes.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "https://cms.isoteli.com/wp-content/uploads/2026/10/box-rosas.jpg",
    "imageAlt": "Box Clásico - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "https://cms.isoteli.com/wp-content/uploads/2026/10/box-rosas.jpg",
        "alt": "Box Clásico - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 210.00",
    "numericPrice": 210.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  },
  {
    "id": "cG9zdDozMQ==",
    "slug": "bouquetsutil",
    "name": "BOUQUETSUTIL",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "BOUQUETSUTIL elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "fullDescription": "BOUQUETSUTIL elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "BOUQUETSUTIL - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "BOUQUETSUTIL - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 53.00",
    "numericPrice": 53.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  },
  {
    "id": "cG9zdDozMw==",
    "slug": "bouquet-vip",
    "name": "BOUQUET VIP",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "BOUQUET VIP elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "fullDescription": "BOUQUET VIP elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "BOUQUET VIP - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "BOUQUET VIP - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 120.00",
    "numericPrice": 120.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  },
  {
    "id": "cG9zdDozMg==",
    "slug": "bouquetmetalico",
    "name": "BOUQUET METÁLICO",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "BOUQUET METÁLICO elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "fullDescription": "BOUQUET METÁLICO elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "BOUQUET METÁLICO - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "BOUQUET METÁLICO - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 70.00",
    "numericPrice": 70.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  },
  {
    "id": "cG9zdDozMA==",
    "slug": "bouquet-clasico",
    "name": "BOUQUET CLÁSICO",
    "productType": "simple",
    "categorySlug": "globos-y-bouquets",
    "categoryLabel": "Globos & Bouquets",
    "shortDescription": "BOUQUET CLÁSICO elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "fullDescription": "BOUQUET CLÁSICO elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "botanicalItems": [
      "Flores frescas seleccionadas",
      "Follaje andino",
      "Envoltorio de diseño"
    ],
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "BOUQUET CLÁSICO - ISOTELI Florería Arequipa",
    "gallery": [
      {
        "url": "/images/producto_sin_foto.svg",
        "alt": "BOUQUET CLÁSICO - ISOTELI Florería Arequipa"
      }
    ],
    "formattedPrice": "S/ 40.00",
    "numericPrice": 40.0,
    "rating": 5.0,
    "reviewCount": 10,
    "popularity": 90,
    "featuredOnHome": null,
    "variations": []
  }
];

export const FALLBACK_DECORATION_PACKS: readonly ServicePack[] = [
  {
    "id": "cG9zdDoxOQ==",
    "slug": "pack-petit",
    "name": "Pack Petit",
    "lineSlug": "linea-clasica",
    "lineLabel": "Línea Clásica Adultos & Juvenil",
    "topBadge": "Línea Clásica",
    "backingSize": "Backing Escénico",
    "formattedPrice": "S/ 150.00",
    "numericPrice": 150.0,
    "shortDescription": "Pack Petit",
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Pack Petit - ISOTELI Florería Arequipa",
    "ctaLabel": "Reservar Petit",
    "variant": "standard",
    "gridColClass": "md:col-span-3"
  },
  {
    "id": "cG9zdDozNA==",
    "slug": "pack-gold",
    "name": "Pack Gold",
    "lineSlug": "linea-clasica",
    "lineLabel": "Línea Clásica Adultos & Juvenil",
    "topBadge": "Línea Clásica",
    "backingSize": "Backing Escénico",
    "formattedPrice": "S/ 150.00",
    "numericPrice": 150.0,
    "shortDescription": "Un Backing de 2 metros y medio de ancho diseñado de forma personalizada para tu celebración. Incluye Mobiliario y accesorios",
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Pack Gold - ISOTELI Florería Arequipa",
    "ctaLabel": "Reservar Gold",
    "variant": "popular",
    "gridColClass": "md:col-span-5"
  },
  {
    "id": "cG9zdDozNQ==",
    "slug": "pack-deluxe",
    "name": "Pack Deluxe",
    "lineSlug": "linea-clasica",
    "lineLabel": "Línea Clásica Adultos & Juvenil",
    "topBadge": "Línea Clásica",
    "backingSize": "Backing Escénico",
    "formattedPrice": "S/ 150.00",
    "numericPrice": 150.0,
    "shortDescription": "Un Backing de 3 metros de ancho, diseñado de forma personalizada para tu celebración. Incluye Mobiliario – accesorios",
    "imageUrl": "/images/producto_sin_foto.svg",
    "imageAlt": "Pack Deluxe - ISOTELI Florería Arequipa",
    "ctaLabel": "Reservar Deluxe",
    "variant": "deluxe-classic",
    "gridColClass": "md:col-span-4"
  }
];

export const FALLBACK_FURNITURE_RENTALS: readonly FurnitureRental[] = [
  {
    "id": "cG9zdDoyMA==",
    "slug": "lluvia-de-luces",
    "name": "Lluvia de luces",
    "subtitle": "Lluvia de luces elaborado con flores y detalles finos de ISOTELI Arequipa.",
    "icon": "light_mode",
    "formattedPrice": "Consultar",
    "numericPrice": 0.0,
    "unitSuffix": null
  }
];
