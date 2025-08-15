import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const slides = await prisma.headerSlide.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { title, offer, buttonText1, buttonText2, imgUrl } = await req.json();

    if (!title || !offer || !buttonText1 || !buttonText2 || !imgUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const slide = await prisma.headerSlide.create({
      data: { title, offer, buttonText1, buttonText2, imgUrl },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}