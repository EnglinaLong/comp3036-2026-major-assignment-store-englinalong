import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // For Assignment 2: Simple password check
    if (password !== "123") {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ authenticated: true }, env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
