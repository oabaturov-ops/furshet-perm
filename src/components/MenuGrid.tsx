'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import DishModal from '@/components/DishModal'

type CartItem = { name: string; price: string; quantity: number }

type ApiCategory = { id: string; name: string; slug: string; sortOrder: number }

type ApiDish = {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  image2: string | null
  sortOrder: number
  categoryId: string
  composition: { name?: string; amount?: string }[]
}

export default function MenuGrid({
  cartItems,
  setCartItems,
}: {
  cartItems: CartItem[]
  setCartItems: Dispatch<SetStateAction<CartItem[]>>
}) {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [dishes, setDishes] = useState<ApiDish[]>([])
  const [active, setActive] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ApiDish | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return
        setCategories(data.categories ?? [])
        setDishes(data.dishes ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const visible = useMemo(() => {
    const list = active === 'all' ? dishes : dishes.filter((d) => d.categoryId === active)
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder)
  }, [dishes, active])

  const countInCart = (name: string) =>
    cartItems.find((i) => i.name === name)?.quantity ?? 0

  const addToCart = (dish: ApiDish, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === dish.name)
      if (existing) {
        return prev.map((i) =>
          i.name === dish.name ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { name: dish.name, price: String(dish.price), quantity: qty }]
    })
  }

  const minQty = (description: string) => {
    const match = description.match(/от\s*(\d+)/i)
    return match ? Number(match[1]) : null
  }

  const tabClass = (isActive: boolean) =>
    `rounded-full border px-5 py-2 text-sm transition ${
      isActive
        ? 'border-[#1c1a17] bg-[#1c1a17] text-[#faf6f0]'
        : 'border-[#1c1a17]/20 text-[#1c1a17]/70 hover:border-[#1c1a17] hover:text-[#1c1a17]'
    }`

  return (
    <section id="menu" className="bg-[#faf6f0] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">Меню</p>
          <h2 className="mt-7 font-serif text-3xl text-[#1c1a17] md:text-5xl">
            Блюда фуршета
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#1c1a17]/60">
            Готовые закуски и наборы. Выбирайте по категориям — привезём охлаждённым
            и готовым к подаче.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <button onClick={() => setActive('all')} className={tabClass(active === 'all')}>
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={tabClass(active === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-[#efe9df]" />
                <div className="mt-5 h-5 w-2/3 rounded bg-[#efe9df]" />
                <div className="mt-3 h-4 w-full rounded bg-[#efe9df]" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-16 text-center text-[#1c1a17]/50">
            В этой категории пока нет блюд
          </p>
        ) : (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((dish) => {
              const qty = countInCart(dish.name)
              const min = minQty(dish.description)
              return (
                <article key={dish.id} className="group">
                  {/* Клик по фото и названию открывает карточку */}
                  <div
                    onClick={() => setSelected(dish)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelected(dish)
                    }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#efe9df]">
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      {min ? (
                        <span className="absolute left-4 top-4 rounded-full bg-[#faf6f0]/90 px-3 py-1 text-[11px] tracking-wide text-[#1c1a17]">
                          от {min} шт.
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-5 font-serif text-xl text-[#1c1a17]">{dish.name}</h3>
                  </div>

                  {dish.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1c1a17]/60">
                      {dish.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-lg text-[#1c1a17]">{dish.price} ₽</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(dish)
                      }}
                      className="rounded-full border border-[#1c1a17] px-5 py-2 text-sm transition hover:bg-[#1c1a17] hover:text-[#faf6f0]"
                    >
                      {qty > 0 ? `В корзине · ${qty}` : 'В корзину'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {selected ? (
        <DishModal
          dish={selected}
          onClose={() => setSelected(null)}
          onAdd={(qty) => addToCart(selected, qty)}
        />
      ) : null}
    </section>
  )
}