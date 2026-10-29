/**
 * ==========================================================================
 * SINCRONIZADOR EN VIVO CON WORDPRESS HEADLESS PARA CPANEL ESTÁTICO
 * Hidrata en segundo plano las grillas de Inicio, Catálogo, Servicios y
 * Detalle de Producto directamente contra https://cms.isoteli.com/graphql
 * para que cualquier cambio en WooCommerce se refleje al instante sin rebuild.
 * ==========================================================================
 */

import { ISOTELI_CONTACT, buildWhatsAppUrl } from '../data/business';
import { FLORIST_CATEGORIES, PLACEHOLDER_IMAGE } from '../data/fallback-store';
import {
  getCatalogProducts,
  getServicesAndRentals,
  type CatalogProduct,
  type FurnitureRental,
  type ProductVariationOption,
  type ServicePack,
} from './wp-graphql';

/**
 * Escapa texto dinámico antes de inyectarlo en plantillas HTML del DOM.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renderiza el HTML exacto de `ProductCard.astro` para un producto en vivo.
 */
export function renderProductCardHtml(
  product: CatalogProduct,
  variant: 'catalog' | 'featured' = 'catalog'
): string {
  const defaultVariation: ProductVariationOption | null =
    product.productType === 'variable' && product.variations.length > 0
      ? (product.variations.find((v) => v.badge) ?? product.variations[0] ?? null)
      : null;

  const initialPriceText = defaultVariation
    ? defaultVariation.formattedPrice
    : product.pricePrefix
      ? `${product.pricePrefix} ${product.formattedPrice}`
      : product.formattedPrice;

  const initialNumericPrice = defaultVariation ? defaultVariation.numericPrice : product.numericPrice;

  const initialWhatsAppMessage = defaultVariation
    ? `Hola ISOTELI, deseo ordenar el producto: ${product.name} - Opción: ${defaultVariation.label} (${defaultVariation.formattedPrice})`
    : `Hola ISOTELI, deseo ordenar el producto: ${product.name} (${product.formattedPrice})`;

  const whatsappUrl = buildWhatsAppUrl(initialWhatsAppMessage);
  const productHref = `/producto/${encodeURIComponent(product.slug)}`;
  const safeImage = product.imageUrl || PLACEHOLDER_IMAGE;

  const badgeHtml = product.badge
    ? `<div class="absolute top-3 left-3 flex gap-2">
        <span class="px-3 py-1 rounded-full font-label-md text-label-md uppercase tracking-wider shadow-sm ${
          variant === 'featured' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'
        }">${escapeHtml(product.badge)}</span>
      </div>`
    : '';

  const variationsHtml =
    product.productType === 'variable' && product.variations.length > 0
      ? `<div class="mt-3 pt-2.5 border-t border-surface-container">
          <span class="font-label-md text-[10px] uppercase tracking-wider text-outline block mb-1.5">Elige presentación:</span>
          <div class="flex flex-wrap gap-1.5" role="group" aria-label="Opciones de ${escapeHtml(product.name)}">
            ${product.variations
              .map((v) => {
                const isDefault = defaultVariation?.id === v.id;
                const btnCls = isDefault
                  ? 'bg-primary-fixed text-primary border-primary/40 font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container';
                return `<button
                  type="button"
                  data-var-btn
                  data-var-label="${escapeHtml(v.label)}"
                  data-var-price="${escapeHtml(v.formattedPrice)}"
                  data-var-numeric="${String(v.numericPrice)}"
                  class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer border ${btnCls}"
                >${escapeHtml(v.label)} · ${escapeHtml(v.formattedPrice)}</button>`;
              })
              .join('')}
          </div>
        </div>`
      : '';

  return `<article
    class="product-item group flex flex-col bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/40 ${
      variant === 'featured' ? 'rounded-3xl p-4' : 'rounded-2xl'
    }"
    data-category="${escapeHtml(product.categorySlug)}"
    data-popularity="${String(product.popularity)}"
    data-price="${String(initialNumericPrice)}"
    data-title="${escapeHtml(`${product.name} ${product.shortDescription} ${product.categoryLabel}`)}"
    data-product-name="${escapeHtml(product.name)}"
    data-whatsapp-phone="${escapeHtml(ISOTELI_CONTACT.phoneRaw)}"
  >
    <a
      href="${productHref}"
      class="relative w-full bg-surface-container overflow-hidden block ${
        variant === 'featured' ? 'aspect-[4/4.5] rounded-2xl mb-4' : 'aspect-[4/3]'
      }"
      aria-label="Ver detalles de ${escapeHtml(product.name)}"
    >
      <img
        src="${escapeHtml(safeImage)}"
        alt="${escapeHtml(product.imageAlt)}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      ${badgeHtml}
      <span
        class="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-secondary-container/95 text-secondary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
        aria-hidden="true"
      >
        <span class="material-symbols-outlined text-[18px]">favorite</span>
      </span>
    </a>

    <div class="flex flex-col flex-1 justify-between gap-space-sm ${variant === 'catalog' ? 'p-space-md' : ''}">
      <div>
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">${escapeHtml(
            product.categoryLabel
          )}</span>
          <span class="font-body-sm text-body-sm text-on-surface flex items-center gap-1">
            <span class="material-symbols-outlined icon-filled text-[14px] text-primary" aria-hidden="true">star</span>
            ${product.rating.toFixed(1)} (${product.reviewCount})
          </span>
        </div>

        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
          <a href="${productHref}" class="hover:underline focus:outline-none">${escapeHtml(product.name)}</a>
        </h3>

        <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${escapeHtml(
          product.shortDescription
        )}</p>
        ${variationsHtml}
      </div>

      <div class="pt-3 border-t border-surface-container flex items-center justify-between gap-space-sm">
        <div class="flex flex-col">
          <span class="font-label-md text-[10px] uppercase tracking-wider text-outline">Precio Arequipa</span>
          <span data-card-price class="font-headline text-2xl font-bold text-primary">${escapeHtml(
            initialPriceText
          )}</span>
        </div>

        <a
          data-card-wa-link
          href="${escapeHtml(whatsappUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-full font-label-md text-label-md tracking-wider transition-all shadow-sm hover:scale-[1.02]"
        >
          <span class="material-symbols-outlined text-[17px]" aria-hidden="true">chat</span>
          <span>${variant === 'featured' ? 'Pedir' : 'Pedir por WhatsApp'}</span>
        </a>
      </div>
    </div>
  </article>`;
}

/**
 * Enlaza la interactividad de botones de variación en tarjetas `ProductCard`.
 */
export function bindProductCardVariations(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('article.product-item').forEach((card) => {
    if (card.dataset.varBound === 'true') return;
    card.dataset.varBound = 'true';

    const varBtns = card.querySelectorAll<HTMLButtonElement>('[data-var-btn]');
    if (varBtns.length === 0) return;

    const priceEl = card.querySelector<HTMLElement>('[data-card-price]');
    const waLink = card.querySelector<HTMLAnchorElement>('[data-card-wa-link]');
    const productName = card.dataset.productName || 'Arreglo ISOTELI';
    const phone = card.dataset.whatsappPhone || '51904803219';

    varBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        varBtns.forEach((b) => {
          b.classList.remove('bg-primary-fixed', 'text-primary', 'border-primary/40', 'font-semibold');
          b.classList.add('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/40');
        });

        btn.classList.add('bg-primary-fixed', 'text-primary', 'border-primary/40', 'font-semibold');
        btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/40');

        const varLabel = btn.dataset.varLabel || '';
        const varPrice = btn.dataset.varPrice || '';
        const varNumeric = btn.dataset.varNumeric || '0';

        if (priceEl && varPrice) {
          priceEl.textContent = varPrice;
        }
        card.setAttribute('data-price', varNumeric);

        if (waLink) {
          const message = `Hola ISOTELI, deseo ordenar el producto: ${productName} - Opción: ${varLabel} (${varPrice})`;
          waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        }
      });
    });
  });
}

/**
 * Renderiza el HTML exacto de `ServicePackCard.astro` para un paquete de decoración.
 */
export function renderServicePackCardHtml(pack: ServicePack): string {
  const whatsappHref = buildWhatsAppUrl(
    `Hola ISOTELI, deseo reservar el ${pack.name} - ${pack.lineLabel} (${pack.formattedPrice}, ${pack.backingSize}).`
  );
  const safeImage = pack.imageUrl || PLACEHOLDER_IMAGE;
  const isPanoramic = pack.variant === 'panoramic';
  const isPopular = pack.variant === 'popular';

  if (isPanoramic) {
    return `<article
      class="${escapeHtml(pack.gridColClass)} relative rounded-2xl overflow-hidden min-h-[260px] md:min-h-[290px] group shadow-md flex flex-col justify-end border-2 border-secondary"
      data-line="${escapeHtml(pack.lineSlug)}"
    >
      <img
        src="${escapeHtml(safeImage)}"
        alt="${escapeHtml(pack.imageAlt)}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#181e00]/95 via-[#30312a]/80 to-transparent"></div>
      <div class="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="px-3.5 py-1 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold uppercase tracking-wider">${escapeHtml(
              pack.topBadge
            )}</span>
            <span class="px-3 py-1 rounded-full bg-surface-container-lowest/90 text-primary font-bold text-[12px]">${escapeHtml(
              pack.backingSize
            )}</span>
          </div>
          <h3 class="font-headline-sm text-[28px] text-white font-bold">${escapeHtml(pack.name)}</h3>
          <p class="font-body-sm text-body-sm text-gray-200 mt-1 max-w-xl">${escapeHtml(pack.shortDescription)}</p>
        </div>

        <div class="flex flex-col sm:flex-row items-baseline sm:items-center gap-4 shrink-0">
          <div class="flex flex-col text-left sm:text-right">
            <span class="text-gray-300 text-[11px] uppercase tracking-wider">Inversión Total</span>
            <span class="text-[32px] font-extrabold text-[#dee8ad]">${escapeHtml(pack.formattedPrice)}</span>
          </div>
          <a
            href="${escapeHtml(whatsappHref)}"
            target="_blank"
            rel="noopener noreferrer"
            class="py-3 px-6 rounded-full bg-secondary hover:bg-secondary/90 text-on-secondary transition-all font-label-md text-label-md tracking-wider flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">send</span>
            <span>${escapeHtml(pack.ctaLabel)}</span>
          </a>
        </div>
      </div>
    </article>`;
  }

  const topBadgeHtml = isPopular
    ? `<span class="px-3.5 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
        <span class="material-symbols-outlined icon-filled text-[14px]" aria-hidden="true">star</span>
        <span>${escapeHtml(pack.topBadge)}</span>
      </span>`
    : pack.variant === 'deluxe-classic'
      ? `<span class="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold uppercase tracking-wider">${escapeHtml(
          pack.topBadge
        )}</span>`
      : pack.variant === 'thematic-petit'
        ? `<span class="px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold uppercase tracking-wider">${escapeHtml(
            pack.topBadge
          )}</span>`
        : `<span class="px-3 py-1 rounded-full bg-secondary-container/95 text-on-secondary-container font-label-md text-label-md font-bold uppercase tracking-wider backdrop-blur-sm">${escapeHtml(
            pack.topBadge
          )}</span>`;

  const gradientCls = isPopular
    ? 'from-[#3f0300]/95 via-[#3f0300]/55'
    : pack.variant === 'thematic-gold'
      ? 'from-[#2c160c]/95 via-[#2c160c]/55'
      : 'from-[#1b1c16]/95 via-[#1b1c16]/50';

  const ctaCls = isPopular
    ? 'py-3 bg-primary-fixed hover:bg-primary-fixed-dim text-primary shadow-lg'
    : pack.variant === 'thematic-gold'
      ? 'bg-primary hover:bg-primary-container text-on-primary'
      : pack.variant === 'deluxe-classic' || pack.variant === 'thematic-petit'
        ? 'bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary'
        : 'bg-surface-container-lowest/95 hover:bg-white text-primary';

  return `<article
    class="${escapeHtml(pack.gridColClass)} relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[340px] group flex flex-col justify-end ${
      isPopular ? 'shadow-md border-2 border-primary-fixed' : 'shadow-sm border border-outline-variant/30'
    }"
    data-line="${escapeHtml(pack.lineSlug)}"
  >
    <img
      src="${escapeHtml(safeImage)}"
      alt="${escapeHtml(pack.imageAlt)}"
      loading="lazy"
      decoding="async"
      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div class="absolute inset-0 bg-gradient-to-t to-transparent ${gradientCls}"></div>

    <div class="relative z-10 flex flex-col justify-between h-full ${isPopular ? 'p-6' : 'p-5 sm:p-6'}">
      <div class="flex items-start justify-between gap-2">
        ${topBadgeHtml}
        <span class="px-3 py-1 rounded-full font-bold text-[12px] shrink-0 ${
          isPopular ? 'bg-primary-fixed text-primary' : 'bg-surface-container-lowest/90 text-primary'
        }">${escapeHtml(pack.backingSize)}</span>
      </div>

      <div class="pt-8">
        <div class="flex items-baseline justify-between gap-2 mb-1.5">
          <div>
            ${
              isPopular
                ? `<span class="text-white/80 font-label-md text-[11px] uppercase block tracking-wider">${escapeHtml(
                    pack.lineLabel
                  )}</span>`
                : ''
            }
            <h3 class="font-headline-sm text-white font-bold ${
              isPopular || pack.variant === 'thematic-gold' ? 'text-[26px]' : 'text-headline-sm'
            }">${escapeHtml(pack.name)}</h3>
          </div>
          <span class="font-extrabold shrink-0 ${
            isPopular
              ? 'text-[28px] text-[#ffdad3]'
              : pack.variant === 'thematic-gold'
                ? 'text-[26px] text-[#ffdbce]'
                : 'text-[23px] text-[#ffdad3]'
          }">${escapeHtml(pack.formattedPrice)}</span>
        </div>

        <p class="font-body-sm text-body-sm text-gray-200 mb-3.5 line-clamp-2">${escapeHtml(
          pack.shortDescription
        )}</p>

        <a
          href="${escapeHtml(whatsappHref)}"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full py-2.5 px-4 rounded-full transition-all font-label-md text-label-md tracking-wider flex items-center justify-center gap-2 font-bold shadow-md hover:scale-[1.02] ${ctaCls}"
        >
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">send</span>
          <span>${escapeHtml(pack.ctaLabel)}</span>
        </a>
      </div>
    </div>
  </article>`;
}

/**
 * Renderiza el HTML exacto de `FurnitureRentalItem.astro` para un accesorio en alquiler.
 */
export function renderFurnitureRentalItemHtml(item: FurnitureRental): string {
  const priceLabel = item.unitSuffix ? `${item.formattedPrice} ${item.unitSuffix}` : item.formattedPrice;
  const whatsappHref = buildWhatsAppUrl(
    `Hola ISOTELI, deseo consultar disponibilidad de alquiler de mobiliario: ${item.name} (${priceLabel}).`
  );

  return `<a
    data-rental-item
    href="${escapeHtml(whatsappHref)}"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Cotizar alquiler de ${escapeHtml(item.name)} (${escapeHtml(priceLabel)}) por WhatsApp"
    class="group bg-surface-container-lowest hover:bg-surface-container-low p-4 rounded-lg border border-outline-variant/25 hover:border-primary/30 shadow-sm hover:shadow transition-all flex items-center justify-between gap-3"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-10 h-10 rounded-full bg-surface-container group-hover:bg-primary-fixed flex items-center justify-center text-primary shrink-0 transition-colors">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">${escapeHtml(item.icon)}</span>
      </div>
      <div class="min-w-0">
        <span class="font-medium text-on-surface group-hover:text-primary transition-colors block text-[15px] truncate">${escapeHtml(
          item.name
        )}</span>
        <span class="text-body-sm text-on-surface-variant block truncate">${escapeHtml(item.subtitle)}</span>
      </div>
    </div>

    <span class="font-bold text-primary text-[18px] shrink-0">
      ${escapeHtml(item.formattedPrice)}${
        item.unitSuffix
          ? `<span class="text-[12px] font-normal text-on-surface-variant"> ${escapeHtml(item.unitSuffix)}</span>`
          : ''
      }
    </span>
  </a>`;
}

/**
 * Sincroniza en tiempo real las secciones de Colecciones y Más Vendidos en `/` (Home).
 */
export async function syncHomePage(): Promise<void> {
  const collectionsGrid = document.getElementById('homeCollectionsGrid');
  const bestSellersGrid = document.getElementById('homeBestSellersGrid');
  if (!collectionsGrid && !bestSellersGrid) return;

  const { products, source } = await getCatalogProducts();
  if (source === 'fallback') return;

  const pickUnique = (preferred: readonly CatalogProduct[], limit = 4) => {
    const seen = new Set<string>();
    const out: CatalogProduct[] = [];
    for (const item of [...preferred, ...products]) {
      if (item && !seen.has(item.slug)) {
        seen.add(item.slug);
        out.push(item);
        if (out.length >= limit) break;
      }
    }
    return out;
  };

  const wpOrigin = products.filter((p) => !p.id.startsWith('fb-'));

  if (collectionsGrid) {
    const highlights = pickUnique([
      ...wpOrigin,
      ...products.filter((p) => p.featuredOnHome === 'collection' || p.featuredOnHome === 'both'),
    ]);
    collectionsGrid.innerHTML = highlights
      .map((item, idx) => {
        const href = `/producto/${encodeURIComponent(item.slug)}`;
        const safeImg = item.imageUrl || PLACEHOLDER_IMAGE;
        const priceLabel = item.pricePrefix
          ? `${item.pricePrefix} ${item.formattedPrice}`
          : item.formattedPrice;
        const waHref = buildWhatsAppUrl(
          `Hola ISOTELI, quisiera pedir: ${item.name} (${item.formattedPrice})`
        );
        const badgeHtml = item.badge
          ? `<span class="absolute top-3 left-3 font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider font-semibold ${
              idx === 1
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest/90 backdrop-blur-sm text-primary'
            }">${escapeHtml(item.badge)}</span>`
          : '';

        return `<div class="group relative bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-3xl p-3 flex flex-col shadow-sm hover:shadow-xl">
          <a href="${href}" class="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container block">
            <img
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="${escapeHtml(item.imageAlt)}"
              loading="lazy"
              src="${escapeHtml(safeImg)}"
              onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"
            />
            ${badgeHtml}
          </a>
          <div class="pt-4 pb-2 px-3 flex items-center justify-between gap-2">
            <div class="flex flex-col min-w-0">
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                <a href="${href}">${escapeHtml(item.name)}</a>
              </h3>
              <span class="font-body-md text-body-md text-on-surface-variant">${escapeHtml(priceLabel)}</span>
            </div>
            <a
              aria-label="Pedir ${escapeHtml(item.name)} por WhatsApp"
              class="w-10 h-10 rounded-full bg-secondary-container hover:bg-secondary text-secondary hover:text-on-secondary flex items-center justify-center transition-colors shadow-sm shrink-0"
              href="${escapeHtml(waHref)}"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span>
            </a>
          </div>
        </div>`;
      })
      .join('');
  }

  if (bestSellersGrid) {
    const sellers = pickUnique([
      ...wpOrigin,
      ...products.filter((p) => p.featuredOnHome === 'bestseller' || p.featuredOnHome === 'both'),
    ]);
    bestSellersGrid.innerHTML = sellers.map((p) => renderProductCardHtml(p, 'featured')).join('');
    bindProductCardVariations(bestSellersGrid);
  }
}

/**
 * Sincroniza en tiempo real `/catalogo`, actualizando contadores de categorías y filtros activos.
 */
export async function syncCatalogPage(onUpdated?: () => void): Promise<void> {
  const catalogGrid = document.getElementById('catalogGrid');
  if (!catalogGrid) return;

  const { products, source } = await getCatalogProducts();
  if (source === 'fallback') return;

  catalogGrid.innerHTML = products.map((p) => renderProductCardHtml(p, 'catalog')).join('');
  bindProductCardVariations(catalogGrid);

  // Actualizar contadores en píldoras de categorías
  const allBtn = document.querySelector<HTMLButtonElement>('.category-btn[data-category="all"]');
  if (allBtn) {
    allBtn.textContent = `Todos (${products.length})`;
  }

  for (const cat of FLORIST_CATEGORIES) {
    const btn = document.querySelector<HTMLButtonElement>(`.category-btn[data-category="${cat.slug}"]`);
    if (btn) {
      const count = products.filter((p) => p.categorySlug === cat.slug).length;
      btn.textContent = `${cat.shortLabel} (${count})`;
    }
  }

  onUpdated?.();
}

/**
 * Sincroniza en tiempo real `/servicios` (Paquetes Clásicos, Temáticos y Alquiler de Mobiliario).
 */
export async function syncServicesPage(): Promise<void> {
  const classicGroup = document.querySelector<HTMLElement>('[data-pack-group="linea-clasica"]');
  const thematicGroup = document.querySelector<HTMLElement>('[data-pack-group="linea-tematica-infantil"]');
  const rentalsGrid = document.getElementById('rentalsGrid');
  if (!classicGroup && !thematicGroup && !rentalsGrid) return;

  const { classicPacks, thematicPacks, rentals, source } = await getServicesAndRentals();
  if (source === 'fallback') return;

  if (classicGroup) {
    classicGroup.innerHTML = classicPacks.map((p) => renderServicePackCardHtml(p)).join('');
  }

  if (thematicGroup) {
    const rowPacks = thematicPacks.filter((p) => p.variant !== 'panoramic');
    const panoramicPacks = thematicPacks.filter((p) => p.variant === 'panoramic');
    thematicGroup.innerHTML = `
      ${
        rowPacks.length > 0
          ? `<div class="grid grid-cols-1 md:grid-cols-12 gap-4">${rowPacks
              .map((p) => renderServicePackCardHtml(p))
              .join('')}</div>`
          : ''
      }
      ${
        panoramicPacks.length > 0
          ? `<div class="grid grid-cols-1 md:grid-cols-12 gap-4">${panoramicPacks
              .map((p) => renderServicePackCardHtml(p))
              .join('')}</div>`
          : ''
      }
    `;
  }

  // Actualizar contadores en pestañas de líneas de paquetes
  const btnAll = document.querySelector<HTMLButtonElement>('[data-pack-line-btn="all"]');
  const btnClassic = document.querySelector<HTMLButtonElement>('[data-pack-line-btn="linea-clasica"]');
  const btnThematic = document.querySelector<HTMLButtonElement>(
    '[data-pack-line-btn="linea-tematica-infantil"]'
  );
  if (btnAll) btnAll.textContent = `Todas las Líneas (${classicPacks.length + thematicPacks.length})`;
  if (btnClassic) btnClassic.textContent = `Línea Clásica (${classicPacks.length})`;
  if (btnThematic) btnThematic.textContent = `Línea Temática Infantil / Baby (${thematicPacks.length})`;

  // Actualizar grilla de alquiler preservando la tarjeta fija final "¿Deseas combinar mobiliario?"
  if (rentalsGrid) {
    const staticComboCard = rentalsGrid.querySelector<HTMLElement>('[data-static-rental-cta]');
    const comboHtml = staticComboCard ? staticComboCard.outerHTML : '';
    rentalsGrid.innerHTML = rentals.map((r) => renderFurnitureRentalItemHtml(r)).join('') + comboHtml;
  }
}

/**
 * Sincroniza en tiempo real `/producto/<slug>` y `/detalle-producto` (incluyendo productos
 * nuevos creados después del build estático servidos vía `.htaccess` en cPanel).
 */
export async function syncProductDetailPage(onFormatHydrated?: (price: number, format: string) => void): Promise<void> {
  const root = document.getElementById('product-detail-root');
  if (!root) return;

  // Extrae slug desde /producto/<slug> o query ?slug=<slug>
  const pathMatch = window.location.pathname.match(/\/producto\/([^/?#]+)/);
  const querySlug = new URLSearchParams(window.location.search).get('slug');
  const requestedSlug = decodeURIComponent(pathMatch?.[1] || querySlug || '').trim();

  const { products, source } = await getCatalogProducts();
  if (source === 'fallback' && !requestedSlug) return;

  const product =
    (requestedSlug ? products.find((p) => p.slug === requestedSlug) : products[0]) ?? products[0];
  if (!product) return;

  const formatOptions: readonly ProductVariationOption[] =
    product.variations.length > 0
      ? product.variations
      : [
          {
            id: 'std-option',
            label: 'Presentación Clásica',
            subtitle: product.categoryLabel,
            formattedPrice: product.formattedPrice,
            numericPrice: product.numericPrice,
            badge: 'Estándar',
          },
        ];

  const defaultOption =
    formatOptions.find((opt) => opt.badge) ?? formatOptions[Math.min(1, formatOptions.length - 1)]!;

  // Actualizar metadatos del contenedor raíz y título de pestaña
  root.dataset.productName = product.name;
  root.dataset.basePrice = String(defaultOption.numericPrice);
  root.dataset.baseFormat = defaultOption.label;
  document.title = `${product.name} | ${product.categoryLabel} | ISOTELI Florería & Decoración Arequipa`;

  // Actualizar migas de pan y textos principales
  const bcCat = document.getElementById('detail-breadcrumb-cat') as HTMLAnchorElement | null;
  if (bcCat) {
    bcCat.textContent = product.categoryLabel;
    bcCat.href = `/catalogo#${product.categorySlug}`;
  }
  const bcName = document.getElementById('detail-breadcrumb-name');
  if (bcName) bcName.textContent = product.name;

  const catLabel = document.getElementById('detail-cat-label');
  if (catLabel) catLabel.textContent = `• ${product.categoryLabel}`;

  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = product.name;

  const shortDescEl = document.getElementById('detail-short-desc');
  if (shortDescEl) shortDescEl.textContent = product.shortDescription;

  const fullDescEl = document.getElementById('detail-full-desc');
  if (fullDescEl) fullDescEl.textContent = product.fullDescription ?? product.shortDescription;

  // Actualizar imagen principal y galería de miniaturas
  const mainImg = document.getElementById('main-product-img') as HTMLImageElement | null;
  if (mainImg) {
    mainImg.src = product.imageUrl || PLACEHOLDER_IMAGE;
    mainImg.alt = product.imageAlt;
  }

  const thumbsContainer = document.getElementById('detail-thumbs-container');
  const galleryItems =
    product.gallery.length > 0
      ? product.gallery
      : [{ url: product.imageUrl || PLACEHOLDER_IMAGE, alt: product.imageAlt }];

  if (thumbsContainer) {
    if (galleryItems.length > 1) {
      thumbsContainer.classList.remove('hidden');
      thumbsContainer.innerHTML = galleryItems
        .slice(0, 4)
        .map(
          (thumb, idx) => `<button
            type="button"
            data-thumb-btn
            data-thumb-src="${escapeHtml(thumb.url)}"
            data-thumb-alt="${escapeHtml(thumb.alt)}"
            aria-label="Ver imagen ${idx + 1}: ${escapeHtml(thumb.alt)}"
            class="relative aspect-square rounded-xl overflow-hidden bg-surface-container p-0.5 shadow-sm transition-all focus:outline-none cursor-pointer ${
              idx === 0 ? 'ring-2 ring-primary' : 'hover:opacity-90'
            }"
          >
            <img
              src="${escapeHtml(thumb.url)}"
              alt="${escapeHtml(thumb.alt)}"
              loading="lazy"
              onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"
              class="w-full h-full object-cover rounded-lg"
            />
          </button>`
        )
        .join('');
    } else {
      thumbsContainer.classList.add('hidden');
      thumbsContainer.innerHTML = '';
    }
  }

  // Actualizar selector de formatos / variaciones
  const formatGrid = document.getElementById('detail-format-grid');
  if (formatGrid) {
    formatGrid.className = `grid grid-cols-1 gap-3 ${
      formatOptions.length >= 3
        ? 'sm:grid-cols-3'
        : formatOptions.length === 2
          ? 'sm:grid-cols-2'
          : 'sm:grid-cols-1'
    }`;
    formatGrid.innerHTML = formatOptions
      .map((opt) => {
        const selected = opt.id === defaultOption.id;
        return `<button
          type="button"
          data-size-card
          data-size-name="${escapeHtml(opt.label)}"
          data-size-price="${String(opt.numericPrice)}"
          class="flex flex-col p-4 rounded-xl text-left transition-all cursor-pointer shadow-sm border ${
            selected
              ? 'bg-primary-fixed/40 ring-2 ring-primary border-primary/40'
              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/50'
          }"
        >
          <div class="flex items-center justify-between gap-1">
            <span class="font-semibold text-on-surface text-body-md">${escapeHtml(opt.label)}</span>
            ${
              opt.badge
                ? `<span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-on-secondary">${escapeHtml(
                    opt.badge
                  )}</span>`
                : ''
            }
          </div>
          ${
            opt.subtitle
              ? `<span class="text-body-sm text-on-surface-variant mt-0.5">${escapeHtml(opt.subtitle)}</span>`
              : ''
          }
          <span class="mt-3 font-bold text-primary text-body-md">${escapeHtml(opt.formattedPrice)}</span>
        </button>`;
      })
      .join('');
  }

  const sizeHint = document.getElementById('size-hint');
  if (sizeHint) sizeHint.textContent = defaultOption.label;

  // Actualizar enlace de consulta directa del pie
  const supportWa = document.getElementById('detail-support-wa') as HTMLAnchorElement | null;
  if (supportWa) {
    supportWa.href = buildWhatsAppUrl(`Hola ISOTELI, tengo una consulta sobre el producto: ${product.name}.`);
  }

  // Actualizar productos relacionados
  const relatedGrid = document.getElementById('detail-related-grid');
  if (relatedGrid) {
    const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
    relatedGrid.innerHTML = related.map((rel) => renderProductCardHtml(rel, 'featured')).join('');
    bindProductCardVariations(relatedGrid);
  }

  onFormatHydrated?.(defaultOption.numericPrice, defaultOption.label);
}
