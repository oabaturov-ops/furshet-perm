import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Фуршет Пермь — Кейтеринг под ключ",
  description: "Фуршетное обслуживание в Перми. Меню фуршетов, рецепты от шеф-повара, заказ банкета под ключ.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}