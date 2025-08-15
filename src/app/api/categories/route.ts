import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req : Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    // Create new category
    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
