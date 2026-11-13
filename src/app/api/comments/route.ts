import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await getDb().query(
      'select * from comments where is_approved = true order by created_at desc'
    );
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const text = String(body.text ?? '').trim();

    if (!name || !text) {
      return NextResponse.json({ error: 'Имя и текст обязательны' }, { status: 400 });
    }

    const { rows } = await getDb().query(
      'insert into comments (name, text, is_approved) values ($1, $2, false) returning *',
      [name, text]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}