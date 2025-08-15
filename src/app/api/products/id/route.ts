import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true, // Include category if needed
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return new NextResponse("Failed to fetch product", { status: 500 });
  }
}