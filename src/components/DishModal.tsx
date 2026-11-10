'use client'

import { useEffect, useState } from 'react'

type Dish = {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  image2: string | null
  composition: { name?: string; amount?: string }[]
  minQty: number
}

export default function DishModal({
  dish,
  onClose,
  onAdd,
}: {
  dish: Dish
  onClose: () => void
  onAdd: (qty: number) => void
}) {
  const [qty, setQty] = useState(dish.minQty || 1)
  const [photo, setPhoto] = useState(dish.image ?? '')

  const second = dish.image2

  // Escape закрывает окно и блокирует прокрутку страницы под ним
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const hasComposition = Array.isArray(dish.composition) && dish.composition.length > 0

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#1c1a17]/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-[#faf6f0] shadow-2xl md:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          {/* Фото */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[440px]">
            {photo ? (
              <img src={photo} alt={dish.name} className="h-full w-full object-cover" />
            ) : null}

            {second ? (
              <button
                onClick={() => setPhoto(photo === second ? (dish.image ?? '') : second)}
                className="absolute bottom-4 left-4 rounded-full bg-[#faf6f0]/90 px-4 py-2 text-xs text-[#1c1a17] shadow-sm"
              >
                {photo === second ? 'Первое фото' : 'Второе фото'}
              </button>
            ) : null}

            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf6f0]/90 text-lg text-[#1c1a17] shadow-sm"
            >
              ✕
            </button>
          </div>

          {/* Текст */}
          <div className="flex flex-col p-7 md:p-10">
            <h3 className="font-serif text-2xl text-[#1c1a17] md:text-3xl">{dish.name}</h3>

            {dish.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#1c1a17]/70">
                {dish.description}
              </p>
            ) : null}

            {hasComposition ? (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#b85c68]">Состав</p>
                <ul className="mt-3 space-y-1.5 text-sm text-[#1c1a17]/70">
                  {dish.composition.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between gap-4 border-b border-[#1c1a17]/10 pb-1.5"
                    >
                      <span>{item.name}</span>
                      <span className="text-[#1c1a17]/50">{item.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-auto pt-8">
              <div className="flex items-center justify-between">
                <span className="text-2xl text-[#1c1a17]">{dish.price * qty} ₽</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(dish.minQty || 1, q - 1))}
                    aria-label="Меньше"
                    className="h-9 w-9 rounded-full border border-[#1c1a17]/20 text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-[#1c1a17]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Больше"
                    className="h-9 w-9 rounded-full border border-[#1c1a17]/20 text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onAdd(qty)
                  onClose()
                }}
                className="mt-5 w-full rounded-full bg-[#1c1a17] py-3.5 text-sm font-medium text-[#faf6f0] transition hover:bg-[#b85c68]"
              >
                Добавить в корзину · {dish.price * qty} ₽
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}