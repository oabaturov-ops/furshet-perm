import { getDb } from './db'

export interface SiteComment {
  id: string
  name: string
  text: string
  created_at: string
}

/** Опубликованные отзывы — отдаются на главную при серверном рендере. */
export async function getApprovedComments(): Promise<SiteComment[]> {
  const { rows } = await getDb().query(
    `select id, name, text, created_at
       from comments
      where is_approved = true
      order by created_at desc`
  )

  return rows.map((row: any) => ({
    id: String(row.id),
    name: row.name ?? '',
    text: row.text ?? '',
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at ?? ''),
  }))
}
