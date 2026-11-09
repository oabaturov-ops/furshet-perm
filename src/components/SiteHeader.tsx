'use client'

import { useState } from 'react'

const LINKS = [
  { href: '#menu', label: 'Меню' },
  { href: '#works', label: 'Наши работы' },
  { href: '#about', label: 'О нас' },
  { href: '#contacts', label: 'Контакты' },
]

export default function SiteHeader({
  cartCount,
  onOpenCart,
}: {
  cartCount: number
  onOpenCart: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] border-b border-[#1c1a17]/10 bg-[#faf6f0]/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 md:px-10">
          <a href="#home" className="font-serif text-2xl tracking-wide text-[#1c1a17]">
            Фуршет
          </a>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onOpenCart}
              className="rounded-full px-4 py-2 text-sm text-[#1c1a17] transition hover:text-[#b85c68]"
            >
              Корзина{cartCount > 0 ? ` · ${cartCount}` : ''}
            </button>

            <a
              href="#contacts"
              className="hidden rounded-full bg-[#c8352f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#a82b26] sm:inline-block"
            >
              Обсудить событие
            </a>

            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-5 rounded bg-[#1c1a17] transition-all duration-300 ${
                    open ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[5px] h-[1.5px] w-5 rounded bg-[#1c1a17] transition-all duration-300 ${
                    open ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[10px] h-[1.5px] w-5 rounded bg-[#1c1a17] transition-all duration-300 ${
                    open ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Полноэкранное меню */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#faf6f0] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Закрыть меню"
          className="absolute right-6 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm md:right-10"
        >
          <span className="text-xl leading-none text-[#1c1a17]">✕</span>
        </button>

        <nav className="flex flex-col items-center gap-7">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-serif text-4xl text-[#1c1a17] transition hover:text-[#b85c68] md:text-6xl"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="mt-12 text-sm text-[#1c1a17]/60">
          +7 (902) 809 21 49 · furshetperm159@yandex.ru
        </p>
      </div>
    </>
  )
}