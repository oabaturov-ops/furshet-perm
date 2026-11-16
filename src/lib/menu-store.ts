import { getDb } from './db'

export interface CompositionItem {
  name: string
  amount: string
}

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  image2: string | null
  sortOrder: number
  categoryId: string
  composition: CompositionItem[]
  minQty: number
}

export interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
}

type DishRow = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  image2: string | null
  sort_order: number | null
  category_id: string | null
  composition: CompositionItem[] | null
  min_qty: number | null
}

function mapDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price ?? 0,
    image: row.image,
    image2: row.image2,
    sortOrder: row.sort_order ?? 0,
    categoryId: row.category_id ?? '',
    composition: Array.isArray(row.composition) ? row.composition : [],
    minQty: row.min_qty ?? 1,
  }
}

// ---- Категории ----

export async function getCategories(): Promise<Category[]> {
  const { rows } = await getDb().query(
    'select id, name, slug, sort_order from categories order by sort_order, name'
  )
  return rows.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug ?? '',
    sortOrder: c.sort_order ?? 0,
  }))
}

export async function createCategory(name: string): Promise<Category> {
  const slug = slugify(name)
  const { rows } = await getDb().query(
    'insert into categories (name, slug) values ($1, $2) returning *',
    [name, slug]
  )
  const c = rows[0]
  return { id: c.id, name: c.name, slug: c.slug ?? '', sortOrder: c.sort_order ?? 0 }
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const slug = slugify(name)
  await getDb().query('update categories set name = $1, slug = $2 where id = $3', [
    name,
    slug,
    id,
  ])
}

export async function deleteCategory(id: string): Promise<void> {
  await getDb().query('delete from categories where id = $1', [id])
}

// ---- Блюда ----

export async function getDishes(): Promise<Dish[]> {
  const { rows } = await getDb().query('select * from dishes order by sort_order, name')
  return rows.map(mapDish)
}

export async function createDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
  const { rows } = await getDb().query(
    `insert into dishes
       (name, description, price, image, image2, sort_order, category_id, composition, min_qty)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning *`,
    [
      dish.name,
      dish.description,
      dish.price,
      dish.image,
      dish.image2,
      dish.sortOrder,
      dish.categoryId || null,
      JSON.stringify(dish.composition ?? []),
      dish.minQty ?? 1,
    ]
  )
  return mapDish(rows[0])
}

export async function updateDish(id: string, dish: Partial<Dish>): Promise<void> {
  const { rows } = await getDb().query('select * from dishes where id = $1', [id])
  if (rows.length === 0) throw new Error('Блюдо не найдено')

  const current = mapDish(rows[0])
  const next = { ...current, ...dish }

  await getDb().query(
    `update dishes set
       name = $1, description = $2, price = $3, image = $4, image2 = $5,
       sort_order = $6, category_id = $7, composition = $8, min_qty = $9
     where id = $10`,
    [
      next.name,
      next.description,
      next.price,
      next.image,
      next.image2,
      next.sortOrder,
      next.categoryId || null,
      JSON.stringify(next.composition ?? []),
      next.minQty ?? 1,
      id,
    ]
  )
}

export async function deleteDish(id: string): Promise<void> {
  await getDb().query('delete from dishes where id = $1', [id])
}

// ---- Заказы ----

export interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}

function mapOrder(o: any): Order {
  return {
    id: o.id,
    customer_name: o.customer_name,
    phone: o.phone,
    address: o.address ?? '',
    items: Array.isArray(o.items) ? o.items : [],
    total: Number(o.total) || 0,
    status: o.status ?? 'new',
    created_at: o.created_at,
  }
}

export async function getOrders(): Promise<Order[]> {
  const { rows } = await getDb().query('select * from orders order by created_at desc')
  return rows.map(mapOrder)
}

export async function createOrder(order: {
  customer_name: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
}): Promise<Order> {
  const { rows } = await getDb().query(
    `insert into orders (customer_name, phone, address, items, total)
     values ($1, $2, $3, $4, $5) returning *`,
    [order.customer_name, order.phone, order.address, JSON.stringify(order.items), order.total]
  )
  return mapOrder(rows[0])
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await getDb().query('update orders set status = $1 where id = $2', [status, id])
}

export async function deleteOrder(id: string): Promise<void> {
  await getDb().query('delete from orders where id = $1', [id])
}

// ---- Утилиты ----

export function slugify(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ' ': '-',
  }
  return text
    .toLowerCase()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}