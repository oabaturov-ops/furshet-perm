import { NextRequest, NextResponse } from 'next/server';
import { readMenu, writeMenu, generateId } from '@/lib/menu-store';

export async function GET() {
  const menu = readMenu();
  return NextResponse.json(menu.categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const menu = readMenu();
  const newCat = { id: generateId(), ...body };
  menu.categories.push(newCat);
  writeMenu(menu);
  return NextResponse.json(newCat, { status: 201 });
}