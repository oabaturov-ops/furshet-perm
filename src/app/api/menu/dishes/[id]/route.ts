import { NextRequest, NextResponse } from 'next/server';
import { readMenu, writeMenu } from '@/lib/menu-store';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = readMenu();
  const index = menu.dishes.findIndex(d => d.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await request.json();
  menu.dishes[index] = { ...menu.dishes[index], ...body };
  writeMenu(menu);
  return NextResponse.json(menu.dishes[index]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = readMenu();
  menu.dishes = menu.dishes.filter(d => d.id !== id);
  writeMenu(menu);
  return NextResponse.json({ success: true });
}