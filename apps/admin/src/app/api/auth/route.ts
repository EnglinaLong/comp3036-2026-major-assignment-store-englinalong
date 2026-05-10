import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

function clearAuthCookie(response: NextResponse) {
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };

    if (body.password !== env.PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ authenticated: true }, env.JWT_SECRET || "", {
      expiresIn: "10m",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  return clearAuthCookie(NextResponse.json({ success: true }));
}
