export default function AboutStory() {
  return (
    <section id="about" className="bg-[#faf6f0] px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-20">
        {/* Текст */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">О нас</p>
          <h2 className="mt-7 font-serif text-3xl leading-[1.15] text-[#1c1a17] md:text-5xl">
            Готовим так,<br />
            чтобы вас запомнили
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#1c1a17]/70">
            <p>
              Мы — фуршетная служба в Перми. С 2015 года собираем столы для свадеб,
              корпоративов и семейных праздников: от камерных ужинов на десять человек
              до приёмов на пятьсот гостей.
            </p>
            <p>
              Готовим сами, на своей кухне, в день события. Никаких полуфабрикатов
              и заморозки: канапе, тарталетки, рулетики и десерты собираем вручную,
              чтобы к моменту подачи всё было свежим.
            </p>
            <p>
              Привозим в термоконтейнерах и помогаем расставить. Вам остаётся встретить
              гостей — остальное мы берём на себя.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#1c1a17]/10 pt-8">
            <div>
              <dt className="font-serif text-2xl text-[#1c1a17]">2015</dt>
              <dd className="mt-1 text-xs leading-snug text-[#1c1a17]/55">
                год основания
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-[#1c1a17]">500</dt>
              <dd className="mt-1 text-xs leading-snug text-[#1c1a17]/55">
                гостей максимум
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-[#1c1a17]">15 000 ₽</dt>
              <dd className="mt-1 text-xs leading-snug text-[#1c1a17]/55">
                доставка бесплатно от
              </dd>
            </div>
          </dl>
        </div>

        {/* Фото */}
        <div className="relative">
          <div className="overflow-hidden rounded-[28px] bg-[#efe9df]">
            <img
              src="/images/hero1.jpg"
              alt="Сервировка фуршета"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          {/* Цитата поверх фото */}
          <div className="absolute -bottom-6 -left-6 hidden max-w-[240px] rounded-2xl bg-[#faf6f0] p-6 shadow-[0_20px_50px_rgba(28,26,23,0.15)] md:block">
            <p className="font-serif text-lg leading-snug text-[#1c1a17]">
              Вы — гости.<br />Всё остальное — мы.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}