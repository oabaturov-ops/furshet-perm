'use client'

import { useEffect, useRef } from 'react'

export default function IntroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wrap.classList.add('scroll-visible')
          video.play().catch(() => {
            /* автоплей может быть заблокирован — не страшно */
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-[#faf6f0] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">О нас</p>
        <h2 className="mt-8 font-serif text-3xl leading-[1.15] text-[#1c1a17] md:text-5xl">
          Красивая еда без хлопот:<br />
          мы готовим — вы принимаете гостей
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#1c1a17]/70">
          Канапе, тарталетки, наборы и десерты готовим в день заказа
          из свежих продуктов и привозим к нужному часу.
          Остаётся только выставить на стол.
        </p>
      </div>

      <div ref={wrapRef} className="scroll-hidden mx-auto mt-16 max-w-5xl">
        <div className="overflow-hidden rounded-[28px] bg-[#efe9df] shadow-[0_30px_80px_rgba(28,26,23,0.12)]">
          <video
            ref={videoRef}
            className="aspect-video h-full w-full object-cover"
            src="/video/hero.mp4"
            poster="/images/video-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  )
}