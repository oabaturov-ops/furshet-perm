import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Как фуршетная служба «Фуршет Пермь» собирает, хранит и обрабатывает персональные данные посетителей сайта.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#faf6f0] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-[#b85c68] hover:underline">
          ← На главную
        </Link>

        <h1 className="mt-8 font-serif text-3xl leading-tight text-[#1c1a17] md:text-4xl">
          Политика обработки персональных данных
        </h1>
        <p className="mt-4 text-sm text-[#1c1a17]/50">
          Редакция от 12 ноября 2026 года
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-[#1c1a17]/75">
          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">1. Оператор</h2>
            <p className="mt-3">
              Оператор персональных данных — [указать организацию: ИП / ООО,
              ИНН, ОГРН], адрес: {SITE.street}, {SITE.city}. Контакт для обращений:
              {" "}
              <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
                {SITE.email}
              </a>
              , телефон: {SITE.phone}.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">2. Какие данные мы собираем</h2>
            <p className="mt-3">
              Только те, которые вы указываете сами при оформлении заказа,
              заявки на фуршет или отзыва:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>имя;</li>
              <li>номер телефона;</li>
              <li>адрес доставки мероприятия (если указан);</li>
              <li>дата события, количество гостей, комментарий;</li>
              <li>текст отзыва и подпись к нему.</li>
            </ul>
            <p className="mt-3">
              Дополнительно автоматически собираются обезличенные данные о посещении:
              IP-адрес, тип устройства и браузера, страницы просмотра, источник перехода.
              Это необходимо для работы сайта и статистики.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">3. Цели обработки</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>связаться с вами по заявке и согласовать заказ;</li>
              <li>доставить и передать заказ по указанному адресу;</li>
              <li>опубликовать отзыв на сайте после проверки;</li>
              <li>вести статистику посещений и улучшать сайт.</li>
            </ul>
            <p className="mt-3">
              Мы не используем ваши данные для рекламных рассылок без отдельного согласия
              и не продаём их третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">4. Правовые основания</h2>
            <p className="mt-3">
              Обработка ведётся на основании вашего согласия (пункт 1 части 1 статьи 6
              Федерального закона № 152-ФЗ «О персональных данных»), выраженного
              проставлением отметки в форме на сайте, а также для исполнения договора,
              стороной которого вы являетесь.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">5. Где хранятся данные</h2>
            <p className="mt-3">
              Персональные данные хранятся в базе данных на сервере, расположенном
              на территории Российской Федерации. Передача данных за пределы РФ
              не осуществляется.
            </p>
            <p className="mt-3">
              Для отправки уведомлений о заказах используется электронная почта;
              для статистики — сервис Яндекс.Метрика (ООО «Яндекс»), который обрабатывает
              обезличенные данные в соответствии со своей политикой.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">6. Сроки хранения</h2>
            <p className="mt-3">
              Заявки и заказы хранятся не дольше, чем это необходимо для исполнения
              заказа и требований бухгалтерского учёта. Отзывы хранятся до отзыва
              согласия или удаления по вашей просьбе. Обезличенная статистика
              хранится бессрочно.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">7. Ваши права</h2>
            <p className="mt-3">
              Вы вправе запросить сведения об обработке ваших данных, потребовать
              их уточнения, блокирования или удаления, а также отозвать согласие.
              Для этого напишите на {" "}
              <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
                {SITE.email}
              </a>
              . Мы ответим в срок, установленный законом.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">8. Файлы cookie</h2>
            <p className="mt-3">
              Сайт использует cookie для сохранения корзины и работы статистики.
              Вы можете отключить cookie в настройках браузера — часть функций
              при этом может работать некорректно.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1c1a17]">9. Изменения политики</h2>
            <p className="mt-3">
              Мы можем обновлять эту политику. Актуальная редакция всегда доступна
              на этой странице; дата редакции указана в начале.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}