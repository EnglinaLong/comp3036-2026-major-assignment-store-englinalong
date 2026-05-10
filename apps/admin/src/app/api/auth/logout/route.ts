import { NextRequest, NextResponse } from "next/server";

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  response.cookies.set("password", "", {
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function GET(request: NextRequest) {
  return clearAuthCookies(NextResponse.redirect(new URL("/", request.url)));
}

export async function POST() {
  return clearAuthCookies(NextResponse.json({ success: true }));
}
