import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all products
export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
  });
  return NextResponse.json(products);
}

// POST a new product
export async function POST(req: Request) {
  const { name, description, price, quantity, categoryId, images } = await req.json();

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      quantity,
      categoryId,
      images: {
        create: images.map((url: string) => ({ url })),
      },
    },
    include: { images: true, category: true },
  });

  return NextResponse.json(newProduct);
}
