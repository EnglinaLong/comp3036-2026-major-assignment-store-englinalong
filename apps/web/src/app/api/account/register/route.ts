import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import {
  isValidCustomerEmail,
  normalizeCustomerEmail,
  toCustomerProfile,
} from "@/lib/customerAuth";

type RegisterCustomerBody = {
  name?: string;
  email?: string;
  password?: string;
};

function validate(body: RegisterCustomerBody) {
  const name = body.name?.trim() ?? "";
  const email = normalizeCustomerEmail(body.email ?? "");
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return "Enter your name, email, and password to create an account.";
  }

  if (!isValidCustomerEmail(email)) {
    return "Enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterCustomerBody;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const name = body.name!.trim();
    const email = normalizeCustomerEmail(body.email!);
    const passwordHash = await hash(body.password!, 10);

    const existingUser = await client.db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 },
      );
    }

    const user = await client.db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "customer",
      },
    });

    return NextResponse.json({
      success: true,
      customer: toCustomerProfile({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create customer account." },
      { status: 400 },
    );
  }
}
