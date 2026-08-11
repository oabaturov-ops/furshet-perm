import { NextRequest, NextResponse } from 'next/server';
import { readMenu, writeMenu, generateId } from '@/lib/menu-store';

export async function GET() {
  const menu = readMenu();
  return NextResponse.json(menu.dishes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const menu = readMenu();
  const newDish = { id: generateId(), ...body };
  menu.dishes.push(newDish);
  writeMenu(menu);
  return NextResponse.json(newDish, { status: 201 });
}