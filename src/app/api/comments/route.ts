import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, text } = body;

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'Имя и текст обязательны' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([{ name: name.trim(), text: text.trim() }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0], { status: 201 });
}