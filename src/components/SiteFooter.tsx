const NAV = [
  { href: '#menu', label: 'Меню' },
  { href: '#works', label: 'Наши работы' },
  { href: '#about', label: 'О нас' },
  { href: '#contacts', label: 'Контакты' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-[#f4eee5] px-6 pb-10 pt-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl text-[#1c1a17]">Фуршет</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#1c1a17]/55">
              Кейтеринг и фуршет с доставкой в Перми. Готовые закуски, наборы
              и десерты для свадеб, корпоративов и семейных праздников.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#1c1a17]/40">Разделы</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-[#1c1a17]/70 transition hover:text-[#1c1a17]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#1c1a17]/40">Связаться</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#1c1a17]/70">
              <li>
                <a href="tel:+79028092149" className="transition hover:text-[#1c1a17]">
                  +7 (902) 809 21 49
                </a>
              </li>
              <li>
                <a href="mailto:furshetperm159@yandex.ru" className="transition hover:text-[#1c1a17]">
                  furshetperm159@yandex.ru
                </a>
              </li>
              <li>г. Пермь, пр. Парковый, 3/1</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#1c1a17]/10 pt-7 text-xs text-[#1c1a17]/45 md:flex-row">
          <p>© {new Date().getFullYear()} Фуршет Пермь. Все права защищены.</p>

          <a href="/privacy" className="transition hover:text-[#1c1a17]">
            Политика конфиденциальности
          </a>

          <a
            href="https://www.olegwebsolutions.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium tracking-wide text-[#1c1a17]/80 transition hover:text-[#b85c68]"
          >
            Создано OWS Studio
          </a>
        </div>
      </div>
    </footer>
  )
}