import { NextRequest, NextResponse } from 'next/server';
import { readMenu, writeMenu } from '@/lib/menu-store';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = readMenu();
  const index = menu.categories.findIndex(c => c.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await request.json();
  menu.categories[index] = { ...menu.categories[index], ...body };
  writeMenu(menu);
  return NextResponse.json(menu.categories[index]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = readMenu();
  menu.categories = menu.categories.filter(c => c.id !== id);
  writeMenu(menu);
  return NextResponse.json({ success: true });
}