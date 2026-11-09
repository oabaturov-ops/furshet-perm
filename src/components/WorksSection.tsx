'use client'

import ScrollReveal from '@/components/ScrollReveal'

// Фото для галереи. Меняйте пути и подписи — вёрстка подстроится сама
const WORKS = [
  { src: '/images/top-left.jpg', category: 'Свадьба', title: 'Ужин на 40 персон' },
  { src: '/images/hero1.jpg', category: 'Банкет', title: 'Праздничный зал' },
  { src: '/images/top-right.jpg', category: 'Фуршет', title: 'Подача у моря' },
  { src: '/images/hero3.jpg', category: 'Корпоратив', title: 'Вечерний приём' },
  { src: '/images/video-poster.jpg', category: 'Банкет', title: 'Стол со свечами' },
  { src: '/images/hero4.jpg', category: 'День рождения', title: 'Семейный праздник' },
]

export default function WorksSection() {
  return (
    <section id="works" className="bg-[#faf6f0] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">
            Наши работы
          </p>
          <h2 className="mt-7 font-serif text-3xl text-[#1c1a17] md:text-5xl">
            Столы, которые запомнили
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#1c1a17]/60">
            Свадьбы, корпоративы и семейные праздники в Перми.
            Каждый стол собираем под событие — от подачи до последнего бокала.
          </p>
        </div>

        <ScrollReveal className="mt-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((work) => (
              <figure
                key={work.src}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#efe9df]"
              >
                <img
                  src={work.src}
                  alt={work.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />

                {/* Затемнение снизу, чтобы подпись читалась */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1c1a17]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#faf6f0]/70">
                    {work.category}
                  </p>
                  <p className="mt-2 font-serif text-xl text-[#faf6f0]">{work.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-14 text-center">
          <a
            href="#contacts"
            className="inline-block rounded-full border border-[#1c1a17] px-9 py-3.5 text-sm font-medium text-[#1c1a17] transition hover:bg-[#1c1a17] hover:text-[#faf6f0]"
          >
            Обсудить событие
          </a>
        </div>
      </div>
    </section>
  )
}