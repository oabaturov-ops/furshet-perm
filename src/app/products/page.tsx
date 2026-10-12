// Страница-читатель: берёт товары из МОЕЙ базы PostgreSQL.
// База живёт на сервере web-1; локальному стенду её нет — поэтому вежливая заглушка.
import { Pool } from "pg";

export const dynamic = "force-dynamic"; // читаем базу В МОМЕНТ запроса, а не при сборке

type Product = {
  id: number;
  name: string;
  price_rub: number;
};

async function readProducts(): Promise<Product[] | null> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null; // адреса базы нет (локальный стенд)
  }
  const pool = new Pool({ connectionString: url });
  try {
    const result = await pool.query(
      "SELECT id, name, price_rub FROM products ORDER BY id"
    );
    return result.rows as Product[];
  } catch {
    return null; // база есть, но не ответила
  } finally {
    await pool.end();
  }
}

export default async function ProductsPage() {
  const products = await readProducts();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        Читатель: товары из моей базы
      </h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Первая страница нового Furshet, которая живёт на собственной PostgreSQL.
      </p>

      {products === null ? (
        <div style={{
          border: "2px dashed #ccc",
          borderRadius: 12,
          padding: 24,
          color: "#888",
        }}>
          База недоступна на этом стенде. На сервере здесь появятся товары
          из таблицы products.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "12px 0",
            }}>
              <span>{p.name}</span>
              <span style={{ fontWeight: 700 }}>{p.price_rub} ₽</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}