import { connection } from 'next/server'

import HomeClient from '@/components/HomeClient'
import { getApprovedComments, type SiteComment } from '@/lib/comments-store'
import { getCategories, getDishes, type Category, type Dish } from '@/lib/menu-store'
import { buildMenuJsonLd } from '@/lib/menu-seo'

/**
 * Главная рендерится на сервере: меню и отзывы приходят в HTML,
 * поэтому их видят поисковые роботы и посетители без JS.
 *
 * connection() отключает предрендер на сборке — данные всегда свежие
 * из базы, как и обещает админка (правки видны сразу).
 */
export default async function Home() {
  await connection()

  let categories: Category[] = []
  let dishes: Dish[] = []
  let comments: SiteComment[] = []

  try {
    const data = await Promise.all([getCategories(), getDishes(), getApprovedComments()])
    categories = data[0]
    dishes = data[1]
    comments = data[2]
  } catch (error) {
    // База недоступна — отдаём страницу без меню, клиент дозагрузит его из /api/menu.
    console.error('[home] не удалось загрузить данные для рендера:', error)
  }

  const jsonLd = dishes.length > 0 ? buildMenuJsonLd(categories, dishes) : null

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
      <HomeClient categories={categories} dishes={dishes} comments={comments} />
    </>
  )
}
