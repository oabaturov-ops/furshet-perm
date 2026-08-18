import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Фуршет Пермь — Фуршетная служба под ключ",
  description: "Фуршетная служба Пермь. Кейтеринг под ключ: фуршетное обслуживание корпоративов, свадеб, дней рождений. Доставка, обслуживание на месте, меню на любой бюджет.",
  keywords: "фуршет Пермь, кейтеринг Пермь, фуршетное обслуживание, заказ фуршета, банкеты Пермь, выездное обслуживание, кейтеринг под ключ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Фуршет Пермь — Фуршетная служба под ключ",
    description: "Фуршетная служба в Перми. Кейтеринг под ключ для мероприятий любого масштаба.",
    url: "https://furshet-perm.ru",
    siteName: "Фуршет Пермь",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Фуршет Пермь",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#e53935" />
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}