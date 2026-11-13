"use client";

import { useState, useEffect } from "react";
import { reachGoal } from '@/lib/metrica';
import SiteHeader from '@/components/SiteHeader'
import HeroSection from '@/components/HeroSection'
import IntroSection from '@/components/IntroSection'
import MenuGrid from '@/components/MenuGrid'
import WorksSection from '@/components/WorksSection'
import AboutStory from '@/components/AboutStory'
import ContactsBlock from '@/components/ContactsBlock'
import SiteFooter from '@/components/SiteFooter'

interface CartItem {
  name: string;
  price: string;
  quantity: number;
  minQty?: number;
}

/* ============================================
   КОРЗИНА — оформление заказа
   ============================================ */
function CartModal({
  cartItems,
  setCartItems,
  isOpen,
  onClose,
}: {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const total = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price.replace(/\D/g, "")) * item.quantity,
    0
  );
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!agree) {
      setError("Подтвердите согласие на обработку данных");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total,
        }),
      });
      if (res.ok) {
        setCartItems([]);
        reachGoal('order');
        setName("");
        setPhone("");
        setAddress("");
        onClose();
      } else {
        setError("Не удалось отправить заказ. Позвоните нам.");
      }
    } catch {
      setError("Нет связи с сервером. Позвоните нам.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full border-b border-[#1c1a17]/20 bg-transparent py-3 text-sm text-[#1c1a17] outline-none transition placeholder:text-[#1c1a17]/40 focus:border-[#1c1a17]";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1c1a17]/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-[#faf6f0] p-7 shadow-2xl md:rounded-[28px] md:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-2xl text-[#1c1a17]">Оформление заказа</h2>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="text-2xl leading-none text-[#1c1a17]/40 transition hover:text-[#1c1a17]"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя *"
            className={inputClass}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон *"
            className={inputClass}
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Адрес доставки (если нужна)"
            className={inputClass}
          />
        </div>

        {cartItems.length === 0 ? (
          <p className="py-10 text-center text-[#1c1a17]/50">Корзина пуста</p>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-[#1c1a17]/10">
              {cartItems.map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#1c1a17]">{item.name}</p>
                    <p className="text-xs text-[#1c1a17]/50">
                      {item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCartItems(
                          item.quantity <= (item.minQty ?? 1)
                            ? cartItems.filter((c) => c.name !== item.name)
                            : cartItems.map((c) =>
                                c.name === item.name
                                  ? { ...c, quantity: c.quantity - 1 }
                                  : c
                              )
                        )
                      }
                      aria-label="Меньше"
                      className="h-8 w-8 rounded-full border border-[#1c1a17]/20 text-[#1c1a17]"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm text-[#1c1a17]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setCartItems(
                          cartItems.map((c) =>
                            c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c
                          )
                        )
                      }
                      aria-label="Больше"
                      className="h-8 w-8 rounded-full border border-[#1c1a17]/20 text-[#1c1a17]"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-[#1c1a17]/15 pt-4">
              <span className="text-sm text-[#1c1a17]/60">Итого</span>
              <span className="font-serif text-2xl text-[#1c1a17]">{total} ₽</span>
            </div>

            {error ? <p className="mt-3 text-sm text-[#c8352f]">{error}</p> : null}

            <label className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[#1c1a17]/60">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1c1a17]"
              />
              <span>
                Согласен с{" "}
                <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-[#1c1a17]">
                  политикой обработки персональных данных
                </a>
              </span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={sending || !agree}
              className="mt-5 w-full rounded-full bg-[#1c1a17] py-3.5 text-sm font-medium text-[#faf6f0] transition hover:bg-[#b85c68] disabled:opacity-50"
            >
              {sending ? "Отправляем…" : "Оформить заказ"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================
   ОТЗЫВЫ
   ============================================ */
function CommentsSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);

  const inputClass =
    "w-full border-b border-[#1c1a17]/20 bg-transparent py-3 text-sm text-[#1c1a17] outline-none transition placeholder:text-[#1c1a17]/40 focus:border-[#1c1a17]";

  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!agree || !name.trim() || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), text: text.trim() }),
      });
      if (res.ok) {
        setName("");
        setText("");
        setSent(true);
        reachGoal('review');
        setTimeout(() => setSent(false), 6000);
      }
    } catch {}
    setSending(false);
  };

  return (
    <section className="bg-[#faf6f0] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#b85c68]">Отзывы</p>
          <h2 className="mt-7 font-serif text-3xl text-[#1c1a17] md:text-5xl">
            Нас рекомендуют
          </h2>
          <p className="mt-6 text-base text-[#1c1a17]/60">
            Поделитесь впечатлениями о нашем обслуживании
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className={inputClass}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш отзыв"
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <label className="flex items-start gap-2 text-[11px] leading-relaxed text-[#1c1a17]/60">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#1c1a17]"
            />
            <span>
              Согласен с{" "}
              <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-[#1c1a17]">
                политикой обработки персональных данных
              </a>
            </span>
          </label>
          <button
            onClick={handleSubmit}
            disabled={sending || !agree || !name.trim() || !text.trim()}
            className="w-full rounded-full bg-[#1c1a17] py-3.5 text-sm font-medium text-[#faf6f0] transition hover:bg-[#b85c68] disabled:opacity-40"
          >
            {sending ? "Отправляем…" : "Отправить отзыв"}
          </button>

          {sent ? (
            <p className="text-center text-sm text-[#1c1a17]/60">
              Спасибо! Отзыв появится на сайте после проверки.
            </p>
          ) : null}
        </div>

        {!comments || comments.length === 0 ? (
          <p className="mt-12 text-center text-[#1c1a17]/40">
            Пока нет отзывов. Будьте первым!
          </p>
        ) : (
          <div className="mt-12 space-y-4">
            {comments.map((c) => (
              <article key={c.id} className="rounded-2xl bg-[#f4eee5] p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-lg text-[#1c1a17]">{c.name}</span>
                  <span className="text-xs text-[#1c1a17]/40">
                    {new Date(c.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#1c1a17]/70">{c.text}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================
   ГЛАВНАЯ СТРАНИЦА
   ============================================ */
export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main>
      <SiteHeader
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />
      <HeroSection />
      <IntroSection />
      <MenuGrid cartItems={cartItems} setCartItems={setCartItems} />
      <WorksSection />
      <AboutStory />
      <ContactsBlock />
      <CommentsSection />
      <SiteFooter />
      <CartModal
        cartItems={cartItems}
        setCartItems={setCartItems}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </main>
  );
}