'use client'

import { useEffect, useRef, useState } from 'react'

const SLIDES = [
  { src: '/images/top-left.jpg', alt: 'Свадебный стол с белыми цветами и свечами' },
  { src: '/images/top-right.jpg', alt: 'Сервировка стола у моря' },
]

// Буква в круге по центру. Поменяйте на «Ф» или на логотип
const MONOGRAM = 'А/А'

export default function HeroSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [lift, setLift] = useState(0)
  const frame = useRef<number>(0)

  // При скролле фото «приподнимаются»
  useEffect(() => {
    const onScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        setLift(Math.min(window.scrollY * 0.1, 40))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative h-[calc(100svh-72px)] min-h-[520px] w-full overflow-hidden"
    >
      {/* Два фото: на мобильном — друг под другом */}
      <div className="absolute inset-0 grid grid-cols-1 gap-2 bg-[#faf6f0] md:grid-cols-2 md:gap-3">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className="relative overflow-hidden"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-full w-full object-cover transition-[filter] duration-[900ms] ease-out will-change-transform"
              style={{
                transform: `translateY(${-lift}px) scale(1.16)`,
                filter:
                  hovered === index
                    ? 'brightness(0.78)'
                    : hovered === null
                      ? 'brightness(1)'
                      : 'brightness(0.92)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Круг с монограммой по центру — как на референсе */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#faf6f0] shadow-[0_12px_45px_rgba(28,26,23,0.18)] md:h-36 md:w-36">
                    <span className="font-serif text-2xl leading-none tracking-[0.08em] text-[#1c1a17] md:text-4xl">
            {MONOGRAM}
          </span>
        </div>
      </div>
    </section>
  )
}