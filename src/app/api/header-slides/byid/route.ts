import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, title, offer, buttonText1, buttonText2, imgUrl } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing slide id" }, { status: 400 });
    }

    const updatedSlide = await prisma.headerSlide.update({
      where: { id },
      data: { title, offer, buttonText1, buttonText2, imgUrl },
    });
    return NextResponse.json(updatedSlide);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing slide id" }, { status: 400 });
    }

    await prisma.headerSlide.delete({ where: { id } });
    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Optional: Get slide by id
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing slide id" }, { status: 400 });
    }

    const slide = await prisma.headerSlide.findUnique({ where: { id } });
    if (!slide) return NextResponse.json({ error: "Slide not found" }, { status: 404 });

    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch slide" }, { status: 500 });
  }
}
