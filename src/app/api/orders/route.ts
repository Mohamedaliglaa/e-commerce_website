import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapter le chemin selon ton setup

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      status,
      totalAmount,
      address,
      phone,
      items, // [{ productId, quantity, unitPrice }]
    } = body;

    if (!userId || !status || !totalAmount || !address || !phone || !items?.length) {
      return NextResponse.json(
        { error: "Données manquantes dans la requête." },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        status,
        totalAmount,
        address,
        phone,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la commande." },
      { status: 500 }
    );
  }
}
// API route
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
