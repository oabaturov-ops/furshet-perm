import { supabase } from './supabase'

export interface CompositionItem { name: string; amount: string }

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  sortOrder: number
  categoryId: string
  composition: CompositionItem[]
}

export interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
}

// ---- Categories ----

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug ?? '',
    sortOrder: c.sort_order ?? 0,
  }))
}

export async function createCategory(name: string): Promise<Category> {
  const slug = slugify(name)
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug })
    .select()
    .single()
  if (error) throw error
  return { id: data.id, name: data.name, slug: data.slug ?? '', sortOrder: data.sort_order ?? 0 }
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const slug = slugify(name)
  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---- Dishes ----

export async function getDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map((d: any) => ({
    id: d.id,
    name: d.name,
    description: d.description ?? '',
    price: d.price ?? 0,
    image: d.image,
    sortOrder: d.sort_order ?? 0,
    categoryId: d.category_id,
    composition: d.composition ?? [],
  }))
}

export async function createDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
  const { data, error } = await supabase
    .from('dishes')
    .insert({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      sort_order: dish.sortOrder,
      category_id: dish.categoryId,
      composition: dish.composition,
    })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? '',
    price: data.price ?? 0,
    image: data.image,
    sortOrder: data.sort_order ?? 0,
    categoryId: data.category_id,
    composition: data.composition ?? [],
  }
}

export async function updateDish(id: string, dish: Partial<Dish>): Promise<void> {
  const { error } = await supabase
    .from('dishes')
    .update({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      sort_order: dish.sortOrder,
      category_id: dish.categoryId,
      composition: dish.composition,
    })
    .eq('id', id)
  if (error) throw error
}

export async function deleteDish(id: string): Promise<void> {
  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---- Orders ----

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

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((o: any) => ({
    id: o.id,
    customer_name: o.customer_name,
    phone: o.phone,
    address: o.address ?? '',
    items: o.items ?? [],
    total: Number(o.total) ?? 0,
    status: o.status ?? 'new',
    created_at: o.created_at,
  }))
}

export async function createOrder(order: {
  customer_name: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    customer_name: data.customer_name,
    phone: data.phone,
    address: data.address ?? '',
    items: data.items ?? [],
    total: Number(data.total) ?? 0,
    status: data.status ?? 'new',
    created_at: data.created_at,
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---- Helpers ----

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function slugify(text: string): string {
  const m: Record<string, string> = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
    'с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch',
    'ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',' ':'-'
  }
  return text.toLowerCase().split('').map(c => m[c] ?? c).join('')
    .replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'')
}