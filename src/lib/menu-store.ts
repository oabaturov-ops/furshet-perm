import fs from 'fs'
import path from 'path'

export interface CompositionItem { name: string; amount: string }

export interface Dish {
  id: string; name: string; description: string; price: number
  image: string | null; sortOrder: number; categoryId: string
  composition: CompositionItem[]
}

export interface Category { id: string; name: string; slug: string; sortOrder: number }

export interface MenuData { categories: Category[]; dishes: Dish[] }

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'menu.json')

export function readMenu(): MenuData {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8').replace(/^\uFEFF/, '')
  return JSON.parse(raw)
}

export function writeMenu(data: MenuData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

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
