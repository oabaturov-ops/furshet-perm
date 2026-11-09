'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACTS = [
  { label: 'Телефон', value: '+7 (902) 809 21 49', href: 'tel:+79028092149' },
  { label: 'Почта', value: 'furshetperm159@yandex.ru', href: 'mailto:furshetperm159@yandex.ru' },
  { label: 'Telegram', value: '@Abaturova_Furshet_bot', href: 'https://t.me/Abaturova_Furshet_bot' },
  { label: 'ВКонтакте', value: 'furshetperm2', href: 'https://vk.ru/furshetperm2' },
]

export default function ContactsBlock() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    guests: '',
    comment: '',
    company: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    const extra = [
      form.date ? `Дата: ${form.date}` : '',
      form.guests ? `Гостей: ${form.guests}` : '',
      form.comment,
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          comment: extra,
          company: form.company,
        }),
      })
      if (!res.ok) throw new Error('server')
      setStatus('sent')
      setForm({ name: '', phone: '', date: '', guests: '', comment: '', company: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border-b border-[#1c1a17]/20 bg-transparent py-3 text-sm text-[#1c1a17] outline-none transition placeholder:text-[#1c1a17]/40 focus:border-[#1c1a17]'

  return (
    <section id="contacts" className="bg-[#f4eee5] px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:gap-20">
        {/* Левая колонка — контакты */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">Контакты</p>
          <h2 className="mt-7 font-serif text-3xl leading-[1.15] text-[#1c1a17] md:text-5xl">
            Обсудим<br />ваше событие
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#1c1a17]/60">
            Позвоните или оставьте заявку — перезвоним, поможем собрать меню
            и посчитаем стоимость под ваше число гостей.
          </p>

          <dl className="mt-10 space-y-5">
            {CONTACTS.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-[#1c1a17]/40">
                  {item.label}
                </dt>
                <dd className="mt-1">
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-lg text-[#1c1a17] transition hover:text-[#b85c68]"
                  >
                    {item.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border-t border-[#1c1a17]/10 pt-6 text-sm leading-relaxed text-[#1c1a17]/60">
            <p className="text-[#1c1a17]">г. Пермь, пр. Парковый, д. 3/1</p>
            <p className="mt-2">Пн–Пт 9:00–21:00 · Сб–Вс 10:00–22:00</p>
            <p className="mt-2">Доставка по Перми, бесплатно от 15 000 ₽</p>
          </div>
        </div>

        {/* Правая колонка — форма */}
        <div className="rounded-[28px] bg-[#faf6f0] p-7 shadow-[0_24px_60px_rgba(28,26,23,0.08)] md:p-10">
          {status === 'sent' ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl text-[#1c1a17]">Заявка отправлена</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#1c1a17]/60">
                Спасибо! Перезвоним в течение рабочего дня и всё обсудим.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 rounded-full border border-[#1c1a17] px-7 py-3 text-sm transition hover:bg-[#1c1a17] hover:text-[#faf6f0]"
              >
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <p className="font-serif text-2xl text-[#1c1a17]">Оставить заявку</p>

              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ваше имя"
                className={inputClass}
              />

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Телефон"
                className={inputClass}
              />

              <div className="grid grid-cols-2 gap-5">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="number"
                  min={1}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  placeholder="Гостей"
                  className={inputClass}
                />
              </div>

              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Комментарий: повод, пожелания"
                className={`${inputClass} resize-none`}
              />

              {/* Ловушка для ботов — человек её не видит */}
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />

              {status === 'error' && (
                <p className="text-sm text-[#c8352f]">
                  Не удалось отправить. Позвоните нам — так быстрее.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-[#1c1a17] py-3.5 text-sm font-medium text-[#faf6f0] transition hover:bg-[#b85c68] disabled:opacity-50"
              >
                {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-[#1c1a17]/40">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}