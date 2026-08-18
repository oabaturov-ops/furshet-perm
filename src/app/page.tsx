"use client";

interface CartItem {
  name: string;
  price: string;
  quantity: number;
}

import { useState, useEffect } from "react";

/* ============================================
   ДАННЫЕ САЙТА — навигация
   ============================================ */
/* Данные корзины */
interface CartItem {
  name: string;
  price: string;
  quantity: number;
}
   const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

/* Данные корзины */
interface CartItem {
  name: string;
  price: string;
  quantity: number;
}
const navLinks = [
  { id: "home", label: "Главная" },
  { id: "menu", label: "Меню фуршетов" },
  { id: "recipes", label: "Рецепты от шеф-повара" },
  { id: "about", label: "О нас" },
  { id: "contacts", label: "Контакты" },
];

/* ============================================
   NAV — фиксированная навигация
   ============================================ */
function Nav({ cartItems, onOpenCart }: { cartItems: CartItem[]; onOpenCart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: "rgba(10, 10, 10, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #333",
      padding: "0 20px",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 70,
      }}>
        {/* ЛОГОТИП */}
        <a href="#home" style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <img src="/favicon.ico" alt="logo" style={{ width: 36, height: 36 }} />
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
          }}>
            ФУРШЕТ <span style={{ color: "#e53935" }}>ПЕРМЬ</span>
          </span>
        </a>

        {/* ДЕСКТОП МЕНЮ */}
        <div style={{
          display: "flex",
          gap: 25,
          alignItems: "center",
        }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                textDecoration: "none",
                color: "#ccc",
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
            >
              {link.label}
            </a>
          ))}
          {/* КНОПКА КОРЗИНЫ */}
                    <button
            onClick={onOpenCart}
            style={{
              backgroundColor: "#e53935",
              color: "#fff",
              border: "none",
              borderRadius: 25,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Корзина ({cartItems.reduce((s, i) => s + i.quantity, 0)})
          </button>
        </div>

        {/* БУРГЕР — мобильное меню */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
          }}
          className="burger-btn"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* МОБИЛЬНОЕ ВЫПАДАЮЩЕЕ МЕНЮ */}
      {menuOpen && (
        <div style={{
          backgroundColor: "rgba(10, 10, 10, 0.98)",
          padding: "15px 20px",
          borderTop: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
          className="mobile-menu"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "#ccc",
                fontSize: 16,
                padding: "8px 0",
                borderBottom: "1px solid #222",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ============================================
   HERO — главная секция
   ============================================ */
function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        height: isMobile ? "100svh" : "100vh",
        minHeight: isMobile ? 500 : 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {heroImages.map((img, i) => (
        <div
          key={img}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: isMobile ? "scroll" : "fixed",
            opacity: currentSlide === i ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        />
      ))}

      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1,
      }} />

      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 800,
        padding: isMobile ? "0 16px" : "0 20px",
      }}>
        <h1 style={{
          fontSize: isMobile ? 28 : 52,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}>
          Фуршетная <span style={{ color: "#e53935" }}>служба</span>
          <br />в Перми
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 20,
          color: "#ccc",
          marginTop: isMobile ? 12 : 20,
          lineHeight: 1.6,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Создаём незабываемые впечатления для ваших мероприятий.
          Высокая кухня, безупречный сервис и внимание к каждой детали.
        </p>
        <div style={{ marginTop: isMobile ? 20 : 35, display: "flex", gap: isMobile ? 10 : 15, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#menu" style={{
            display: "inline-block",
            backgroundColor: "#e53935",
            color: "#fff",
            textDecoration: "none",
            padding: isMobile ? "10px 20px" : "14px 35px",
            borderRadius: 30,
            fontSize: isMobile ? 13 : 16,
            fontWeight: 600,
          }}>
            Смотреть меню
          </a>
          <a href="#contacts" style={{
            display: "inline-block",
            border: "2px solid #e53935",
            color: "#e53935",
            textDecoration: "none",
            padding: isMobile ? "10px 20px" : "14px 35px",
            borderRadius: 30,
            fontSize: isMobile ? 13 : 16,
            fontWeight: 600,
          }}>
            Заказать фуршет
          </a>
        </div>
      </div>

      <div style={{
        position: "absolute",
        bottom: isMobile ? 20 : 40,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex",
        gap: 10,
      }}>
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: currentSlide === i ? 30 : 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: currentSlide === i ? "#e53935" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "#e53935",
        zIndex: 2,
      }} />
    </section>
  );
}

/* ============================================
   РЕЦЕПТЫ ОТ ШЕФА
   ============================================ */
const recipes = [
  {
    id: 1,
    title: "Тартар из лосося",
    desc: "Свежий лосось, авокадо, каперсы, красный лук, лимонный сок, оливковое масло. Подача на хрустящем тосте с микрозеленью.",
    time: "30 мин",
    difficulty: "Средне",
    ingredients: ["Лосось 300г", "Авокадо 1 шт", "Каперсы 2 ст.л.", "Лимон 1 шт", "Оливковое масло"],
  },
  {
    id: 2,
    title: "Фондю из трёх сыров",
    desc: "Грюйер, Эмменталь и Камамбер с белым вином и чесноком. Подаётся с хлебными кубиками, яблоком и виноградом.",
    time: "20 мин",
    difficulty: "Легко",
    ingredients: ["Грюйер 150г", "Эмменталь 150г", "Камамбер 100г", "Белое вино 100мл", "Чеснок 2 зубчика"],
  },
  {
    id: 3,
    title: "Мини-картофель гратен",
    desc: "Тонкие слои картофеля с сливками, мускатным орехом и тремя видами сыра. Идеальная горячая закуска для фуршета.",
    time: "60 мин",
    difficulty: "Средне",
    ingredients: ["Картофель 1кг", "Сливки 33% 300мл", "Грюйер 100г", "Пармезан 50г", "Мускатный орех"],
  },
  {
    id: 4,
    title: "Рулетики из баклажанов",
    desc: "Запечённые баклажаны с рикоттой, томатами черри, базиликом и бальзамической глазурью. Лёгкая и элегантная закуска.",
    time: "45 мин",
    difficulty: "Легко",
    ingredients: ["Баклажаны 2 шт", "Рикотта 200г", "Черри 10 шт", "Базилик", "Бальзамик"],
  },
  {
    id: 5,
    title: "Шоколадный мусс с малиной",
    desc: "Воздушный тёмный шоколад (70%) с взбитыми сливками и свежей малиной. Подаётся в стеклянных бокалах.",
    time: "25 мин + 2ч",
    difficulty: "Средне",
    ingredients: ["Шоколад 70% 200г", "Сливки 33% 200мл", "Малина 150г", "Сахар 30г", "Яйца 2 шт"],
  },
  {
    id: 6,
    title: "Канапе «Императорское»",
    desc: "Креветки, икра лосося, сливочный сыр, огурец и лимон на хрустящих тостах. Праздничная классика.",
    time: "20 мин",
    difficulty: "Легко",
    ingredients: ["Креветки 200г", "Икра лосося 50г", "Сливочный сыр 150г", "Огурец 1 шт", "Тосты"],
  },
];

function RecipesSection() {
  const [openRecipe, setOpenRecipe] = useState<number | null>(null);

  return (
    <section id="recipes" style={{
      padding: "80px 20px",
      backgroundColor: "#111",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Заголовок */}
        <h2 style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
        }}>
          Рецепты <span style={{ color: "#e53935" }}>от шефа</span>
        </h2>
        <p style={{
          textAlign: "center",
          color: "#888",
          fontSize: 16,
          margin: "0 0 40px 0",
        }}>
          Секреты нашей кухни — попробуйте повторить дома
        </p>

        {/* Сетка рецептов */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 25,
        }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              border: "1px solid #2a2a2a",
              overflow: "hidden",
              transition: "transform 0.3s",
            }}>
              {/* Шапка рецепта */}
              <div style={{
                padding: "20px 24px",
                borderBottom: openRecipe === recipe.id ? "1px solid #e53935" : "none",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                  <span style={{
                    backgroundColor: "#e53935",
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {recipe.difficulty}
                  </span>
                  <span style={{ color: "#888", fontSize: 13 }}>
                    ⏱ {recipe.time}
                  </span>
                </div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 8px 0",
                }}>
                  {recipe.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "#888",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {recipe.desc}
                </p>
              </div>

              {/* Кнопка раскрытия */}
              <button
                onClick={() => setOpenRecipe(openRecipe === recipe.id ? null : recipe.id)}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: "#1a1a1a",
                  borderTop: "1px solid #2a2a2a",
                  color: openRecipe === recipe.id ? "#e53935" : "#ccc",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "color 0.3s",
                }}
              >
                {openRecipe === recipe.id ? "▲ Скрыть ингредиенты" : "▼ Показать ингредиенты"}
              </button>

              {/* Раскрывающийся список ингредиентов */}
              {openRecipe === recipe.id && (
                <div style={{
                  padding: "16px 24px",
                  backgroundColor: "#151515",
                  borderTop: "1px solid #2a2a2a",
                }}>
                  <p style={{
                    fontSize: 13,
                    color: "#e53935",
                    fontWeight: 700,
                    margin: "0 0 10px 0",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}>
                    Ингредиенты:
                  </p>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: "#ccc",
                    fontSize: 14,
                    lineHeight: 2,
                  }}>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ============================================
   О НАС
   ============================================ */
const advantages = [
  { icon: "🏆", title: "Более 10 лет опыта", desc: "Более 300 проведённых мероприятий в Перми" },
  { icon: "👨‍🍳", title: "Шеф-повар", desc: "Профессиональный шеф-повар с опытом в ресторанах высшей категории" },
  { icon: "✨", title: "Свежие продукты", desc: "Только свежие и натуральные продукты от местных поставщиков" },
  { icon: "🎯", title: "Под ключ", desc: "Полный цикл: от разработки меню до подачи и уборки" },
  { icon: "💰", title: "Прозрачные цены", desc: "Фиксированная стоимость без скрытых доплат и наценок" },
  { icon: "🚚", title: "Доставка", desc: "Доставка по Перми. Бесплатная доставка при заказе от 15000 ₽ по городу. Отдалённые районы уточнить при заказе" },
];

function AboutSection() {
  return (
    <section id="about" style={{
      padding: "80px 20px",
      backgroundColor: "#0a0a0a",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Заголовок */}
        <h2 style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
        }}>
          О <span style={{ color: "#e53935" }}>нас</span>
        </h2>
        <p style={{
          textAlign: "center",
          color: "#888",
          fontSize: 16,
          margin: "0 0 20px 0",
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.7,
        }}>
          Мы — команда профессионалов, которые превращают любое мероприятие в незабываемое гастрономическое событие
        </p>

        {/* Текстовый блок */}
        <div style={{
          maxWidth: 800,
          margin: "0 auto 50px auto",
          textAlign: "center",
        }}>
          <p style={{
            color: "#bbb",
            fontSize: 16,
            lineHeight: 1.8,
          }}>
            Компания «Фуршет Пермь» работает на рынке кейтеринговых услуг с 2015 года. За это время мы обслужили более 500 мероприятий — от небольших семейных праздников до крупных корпоративов на 500+ человек. Наша философия — сочетание ресторанного качества с домашним теплом. Мы верим, что каждая тарелка должна быть не только вкусной, но и красивой, а сервис — незаметным и безупречным.
          </p>
        </div>

        {/* Преимущества — сетка */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {advantages.map((item) => (
            <div key={item.title} style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              padding: "24px 20px",
              border: "1px solid #2a2a2a",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 40,
                marginBottom: 12,
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 8px 0",
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: "#888",
                margin: 0,
                lineHeight: 1.5,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   КОНТАКТЫ
   ============================================ */
function ContactsSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    guests: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    /* Здесь потом подключим Telegram bot или API */
    setTimeout(() => {
      setFormStatus("sent");
      setFormData({ name: "", phone: "", date: "", guests: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contacts" style={{
      padding: "80px 20px",
      backgroundColor: "#111",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Заголовок */}
        <h2 style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
        }}>
          <span style={{ color: "#e53935" }}>Контакты</span>
        </h2>
        <p style={{
          textAlign: "center",
          color: "#888",
          fontSize: 16,
          margin: "0 0 50px 0",
        }}>
          Свяжитесь с нами для заказа и расчёта стоимости
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
          className="contacts-grid"
        >
          {/* Левая колонка — инфо */}
          <div>
            <div style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              padding: 30,
              border: "1px solid #2a2a2a",
              marginBottom: 20,
            }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 20px 0",
              }}>
                Свяжитесь с нами
              </h3>

              {[
                { icon: "📞", label: "Телефон", value: "+7 (902) 809 2149", href: "tel:+7 (902) 809 2149" },
                //{ icon: "💬", label: "WhatsApp", value: "+7 900 000-00-00", href: "https://wa.me/79000000000" },
                //{ icon: "✈️", label: "Telegram", value: "@furshet_perm", href: "https://t.me/furshet_perm" },
                { icon: "📧", label: "Email", value: "furshetperm159@yandex.ru", href: "mailto:furshetperm159@yandex.ru" },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid #222",
                    textDecoration: "none",
                    color: "#ccc",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                >
                  <span style={{ fontSize: 22 }}>{contact.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#666" }}>{contact.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{contact.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Адрес */}
            <div style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              padding: 30,
              border: "1px solid #2a2a2a",
            }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 10px 0",
              }}>
                📍 Адрес
              </h3>
              <p style={{
                color: "#ccc",
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0,
              }}>
                г. Пермь, проспект Парковый, д. 3/1<br />
                 </p>
            </div>
          </div>

          {/* Правая колонка — форма */}
          <div style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            padding: 30,
            border: "1px solid #2a2a2a",
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 20px 0",
            }}>
              Оставить заявку
            </h3>
            <form onSubmit={handleSubmit}>
              {[
                { key: "name", placeholder: "Ваше имя *", type: "text" },
                { key: "phone", placeholder: "Телефон *", type: "tel" },
                { key: "date", placeholder: "Дата мероприятия", type: "date" },
                { key: "guests", placeholder: "Количество гостей", type: "text" },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.key === "name" || field.key === "phone"}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    marginBottom: 14,
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              ))}
              <textarea
                placeholder="Пожелания к меню, детали мероприятия..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  marginBottom: 14,
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={formStatus === "sending"}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: formStatus === "sent" ? "#2e7d32" : "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: formStatus === "sending" ? "wait" : "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                {formStatus === "sending" ? "Отправка..." : formStatus === "sent" ? "✓ Заявка отправлена!" : "Отправить заявку"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
function CartModal({ cartItems, setCartItems, isOpen, onClose }: { cartItems: CartItem[]; setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; isOpen: boolean; onClose: () => void }) {
  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/\D/g, "")) * item.quantity, 0);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('Укажите имя и телефон');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
          items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
          total: total,
        })
      });
      if (res.ok) {
        setCartItems([]);
        setName('');
        setPhone('');
        setAddress('');
        onClose();
      } else {
        alert('Ошибка отправки заказа, позвоните нам');
      }
    } catch {
      alert('Нет связи с сервером, позвоните нам');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.7)" }} />
      <div style={{ position: "relative", backgroundColor: "#1a1a1a", borderRadius: 16, border: "1px solid #333", maxWidth: 500, width: "90%", maxHeight: "80vh", overflow: "auto", padding: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Оформление заказа</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 28, cursor: "pointer" }}>X</button>
        </div>

        {/* Контактные данные */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя *"
            style={{ width: "100%", padding: "12px 16px", marginBottom: 10, backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 15, boxSizing: "border-box" }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон *"
            style={{ width: "100%", padding: "12px 16px", marginBottom: 10, backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 15, boxSizing: "border-box" }}
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Адрес доставки (если нужно)"
            style={{ width: "100%", padding: "12px 16px", backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 15, boxSizing: "border-box" }}
          />
        </div>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: 16, padding: "20px 0" }}>Корзина пуста</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #222" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>{item.price} x {item.quantity}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setCartItems(item.quantity === 1 ? cartItems.filter((c) => c.name !== item.name) : cartItems.map((c) => c.name === item.name ? { ...c, quantity: c.quantity - 1 } : c))} style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#333", color: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}>-</button>
                  <span style={{ color: "#fff", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => setCartItems(cartItems.map((c) => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c))} style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#e53935", color: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}>+</button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 0 0", borderTop: "2px solid #e53935", marginTop: 10 }}>
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Итого:</span>
              <span style={{ color: "#e53935", fontSize: 24, fontWeight: 800 }}>{total} руб.</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{ width: "100%", marginTop: 20, padding: 14, backgroundColor: sending ? "#666" : "#e53935", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer" }}
            >
              {sending ? "Отправка..." : "Оформить заказ"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MenuSection({ cartItems, setCartItems }: { cartItems: CartItem[]; setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const [menuCategories, setMenuCategories] = useState<{title: string, items: {name: string, desc: string, price: string, priceNum: number, image: string | null, image2: string | null, composition: any[]}[]}[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [menuLoading, setMenuLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<{name: string, desc: string, price: string, image: string | null, image2: string | null, composition: any[]} | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const [catRes, dishRes] = await Promise.all([
          fetch('/api/menu/categories'),
          fetch('/api/menu/dishes'),
        ]);
        if (!catRes.ok || !dishRes.ok) return;
        const categories = await catRes.json();
        const dishes = await dishRes.json();
        const menu = categories
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((cat: any) => ({
            title: cat.name,
            items: dishes
              .filter((d: any) => d.categoryId === cat.id)
              .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
              .map((d: any) => ({
                name: d.name,
                desc: d.description,
                price: d.price + ' \u20BD',
                priceNum: d.price,
                image: d.image || null,
                image2: d.image2 || null,
                composition: d.composition || [],
              })),
          }))
          .filter((cat: any) => cat.items.length > 0);
        setMenuCategories(menu);
      } catch (e) {
        console.error('Failed to load menu:', e);
      } finally {
        setMenuLoading(false);
      }
    }
    loadMenu();
  }, []);

  if (menuLoading) {
    return (
      <section id="menu" style={{ padding: "80px 20px", backgroundColor: "#0a0a0a" }}>
        <p style={{ textAlign: "center", color: "#888" }}>Загрузка меню...</p>
      </section>
    );
  }

  if (!menuCategories.length) {
    return (
      <section id="menu" style={{ padding: "80px 20px", backgroundColor: "#0a0a0a" }}>
        <p style={{ textAlign: "center", color: "#888" }}>Меню пока пустое</p>
      </section>
    );
  }

  const category = menuCategories[activeCategory];

  return (
    <section id="menu" style={{ padding: "80px 20px", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 10px 0", textTransform: "uppercase" }}>
          Меню <span style={{ color: "#e53935" }}>фуршетов</span>
        </h2>
        <p style={{ textAlign: "center", color: "#888", fontSize: 16, margin: "0 0 40px 0" }}>
          Выберите категорию и добавьте блюда в корзину
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
          {menuCategories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(i)}
              style={{
                padding: "10px 24px", borderRadius: 25,
                border: activeCategory === i ? "none" : "1px solid #444",
                backgroundColor: activeCategory === i ? "#e53935" : "transparent",
                color: activeCategory === i ? "#fff" : "#ccc",
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {category.items.map((item) => (
            <div
              key={item.name}
              onClick={() => setSelectedDish(item)}
              style={{
                backgroundColor: "#1a1a1a", borderRadius: 12,
                border: "1px solid #2a2a2a", transition: "transform 0.3s, border-color 0.3s",
                cursor: "pointer", overflow: "hidden",
              }}
            >
              <div style={{ position: "relative" }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                )}
                {item.image2 && (
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    backgroundColor: "rgba(0,0,0,0.7)", color: "#fff",
                    fontSize: 11, padding: "3px 8px", borderRadius: 10,
                  }}>
                    2 фото
                  </span>
                )}
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 14, color: "#888", margin: "0 0 15px 0", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#e53935" }}>{item.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const ex = cartItems.find((c) => c.name === item.name);
                      if (ex) {
                        setCartItems(cartItems.map((c) => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
                      } else {
                        setCartItems([...cartItems, { name: item.name, price: item.price, quantity: 1 }]);
                      }
                    }}
                    style={{
                      backgroundColor: "#e53935", color: "#fff", border: "none",
                      borderRadius: 20, padding: "8px 18px", fontSize: 13,
                      fontWeight: 600, cursor: "pointer", transition: "background-color 0.3s",
                    }}
                  >
                    + В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно блюда */}
      {selectedDish && (
        <div
          onClick={() => setSelectedDish(null)}
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1a1a1a", borderRadius: 16, maxWidth: 500,
              width: "100%", maxHeight: "90vh", overflowY: "auto",
              border: "1px solid #333",
            }}
          >
            <div style={{ position: "relative" }}>
              {selectedDish.image && (
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                />
              )}
              {selectedDish.image2 && (
                <img
                  src={selectedDish.image2}
                  alt={selectedDish.name}
                  style={{ width: "100%", height: 200, objectFit: "cover", marginTop: 4 }}
                />
              )}
            </div>
            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 10px 0" }}>
                {selectedDish.name}
              </h3>
              <p style={{ fontSize: 15, color: "#aaa", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                {selectedDish.desc}
              </p>
              {selectedDish.composition.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: "#e53935", margin: "0 0 10px 0" }}>Состав:</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedDish.composition.map((c: any, i: number) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", color: "#ccc", fontSize: 14 }}>
                        <span>{c.name}</span>
                        <span style={{ color: "#888" }}>{c.quantity || c.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#e53935" }}>{selectedDish.price}</span>
                <button
                  onClick={() => {
                    const item = selectedDish;
                    const ex = cartItems.find((c) => c.name === item.name);
                    if (ex) {
                      setCartItems(cartItems.map((c) => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
                    } else {
                      setCartItems([...cartItems, { name: item.name, price: item.price, quantity: 1 }]);
                    }
                    setSelectedDish(null);
                  }}
                  style={{
                    backgroundColor: "#e53935", color: "#fff", border: "none",
                    borderRadius: 20, padding: "12px 24px", fontSize: 15,
                    fontWeight: 600, cursor: "pointer",
                  }}
                >
                  + В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
/* ============================================
   FOOTER — временный заглушка (позже расширим)
   ============================================ */
   /* ============================================
   COMMENTS — Отзывы
   ============================================ */
function CommentsSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), text: text.trim() }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setName('');
        setText('');
      }
    } catch {}
    setSending(false);
  };

  return (
    <section id="comments" style={{ padding: "80px 20px", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 10px 0", textTransform: "uppercase" }}>
          Отзывы
        </h2>
        <p style={{ textAlign: "center", color: "#888", fontSize: 16, margin: "0 0 40px 0" }}>
          Поделитесь впечатлениями о нашем обслуживании
        </p>

        {/* Форма */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            style={{ width: "100%", padding: "12px 16px", backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 15, boxSizing: "border-box" }}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш отзыв"
            rows={3}
            style={{ width: "100%", padding: "12px 16px", backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 15, boxSizing: "border-box", resize: "vertical" }}
          />
          <button
            onClick={handleSubmit}
            disabled={sending || !name.trim() || !text.trim()}
            style={{
              alignSelf: "flex-end", padding: "12px 30px",
              backgroundColor: (sending || !name.trim() || !text.trim()) ? "#555" : "#e53935",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
              fontWeight: 600, cursor: (sending || !name.trim() || !text.trim()) ? "not-allowed" : "pointer",
            }}
          >
            {sending ? "Отправка..." : "Отправить отзыв"}
          </button>
        </div>

        {/* Список отзывов */}
        {(!comments || !Array.isArray(comments) || comments.length === 0) ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: 15 }}>Пока нет отзывов. Будьте первым!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {comments.map((c) => (
              <div key={c.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 12, border: "1px solid #2a2a2a", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>{c.name}</span>
                  <span style={{ color: "#666", fontSize: 13 }}>
                    {new Date(c.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ color: "#ccc", fontSize: 15, margin: 0, lineHeight: 1.6 }}>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
/* ============================================
   FOOTER
   ============================================ */
function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0a0a0a",
      borderTop: "1px solid #222",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "50px 20px 30px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 40,
      }}>
        {/* Логотип и описание */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <img src="/favicon.ico" alt="logo" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              ФУРШЕТ <span style={{ color: "#e53935" }}>ПЕРМЬ</span>
            </span>
          </div>
          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Кейтеринг под ключ в Перми. Фуршетное обслуживание мероприятий любого масштаба с доставкой и обслуживанием на месте.
          </p>
        </div>

        {/* Навигация */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px 0" }}>Навигация</h4>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                display: "block",
                color: "#888",
                fontSize: 14,
                textDecoration: "none",
                padding: "4px 0",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Контакты */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px 0" }}>Контакты</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="tel:+79028092149" style={{ color: "#888", fontSize: 14, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
              📞 +7 (902) 809-21-49
            </a>
            <a href="mailto:furshetperm159@yandex.ru" style={{ color: "#888", fontSize: 14, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
              📧 furshetperm159@yandex.ru
            </a>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              📍 г. Пермь, пр. Парковый, д. 3/1
            </p>
          </div>
        </div>

        {/* Соцсети */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px 0" }}>Соцсети</h4>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://vk.ru/furshetperm2" target="_blank" rel="noopener noreferrer"
              style={{
                width: 42, height: 42, borderRadius: 10,
                backgroundColor: "#1a1a1a", border: "1px solid #333",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", fontSize: 20, transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e53935"; e.currentTarget.style.borderColor = "#e53935"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; e.currentTarget.style.borderColor = "#333"; }}
            >
              VK
            </a>
            <a href="https://t.me/Alina_Abaturova" target="_blank" rel="noopener noreferrer"
              style={{
                width: 42, height: 42, borderRadius: 10,
                backgroundColor: "#1a1a1a", border: "1px solid #333",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", fontSize: 20, transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e53935"; e.currentTarget.style.borderColor = "#e53935"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; e.currentTarget.style.borderColor = "#333"; }}
            >
              TG
            </a>
          </div>
        </div>
      </div>

      {/* Нижняя полоска */}
      <div style={{
        borderTop: "1px solid #222",
        padding: "20px",
        textAlign: "center",
        color: "#555",
        fontSize: 13,
      }}>
        © {new Date().getFullYear()} Фуршет Пермь. Все права защищены.
      </div>
    </footer>
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
      <Nav cartItems={cartItems} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <MenuSection cartItems={cartItems} setCartItems={setCartItems} />
      <RecipesSection />
      <AboutSection />
      <ContactsSection />
      <CommentsSection />
      <Footer />
      <CartModal cartItems={cartItems} setCartItems={setCartItems} isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}