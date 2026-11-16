import type { Category, Dish } from './menu-store'

/**
 * Разметка меню для поисковиков: schema.org/Menu.
 *
 * Робот видит не только текст на странице, но и структуру:
 * раздел → блюдо → цена. Это даёт шанс на расширенные сниппеты
 * и на попадание в «меню рядом» в поиске.
 */

function toMenuItem(dish: Dish) {
  return {
    '@type': 'MenuItem',
    name: dish.name,
    ...(dish.description ? { description: dish.description } : {}),
    ...(dish.minQty > 1 ? { eligibleQuantity: { '@type': 'QuantitativeValue', minValue: dish.minQty } } : {}),
    offers: {
      '@type': 'Offer',
      price: String(dish.price),
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function buildMenuJsonLd(categories: Category[], dishes: Dish[]) {
  const knownCategories = new Set(categories.map((category) => category.id))

  const sections = categories
    .map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      hasMenuItem: dishes
        .filter((dish) => dish.categoryId === category.id)
        .map(toMenuItem),
    }))
    .filter((section) => section.hasMenuItem.length > 0)

  const uncategorized = dishes
    .filter((dish) => !knownCategories.has(dish.categoryId))
    .map(toMenuItem)

  if (uncategorized.length > 0) {
    sections.push({ '@type': 'MenuSection', name: 'Другое', hasMenuItem: uncategorized })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Меню фуршета — Фуршет Пермь',
    inLanguage: 'ru-RU',
    hasMenuSection: sections,
  }
}
