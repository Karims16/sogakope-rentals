import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please submit a valid message." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { error: "Please submit a valid message." },
      { status: 400 },
    );
  }

  const contactPayload = payload as ContactPayload;
  const name =
    typeof contactPayload.name === "string" ? contactPayload.name.trim() : "";
  const email =
    typeof contactPayload.email === "string"
      ? contactPayload.email.trim()
      : "";
  const message =
    typeof contactPayload.message === "string"
      ? contactPayload.message.trim()
      : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }
  if (name.length > 100 || email.length > 254 || message.length > 3000) {
    return NextResponse.json(
      { error: "One or more fields exceed the allowed length." },
      { status: 400 },
    );
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SUPPORT_RECIPIENT_EMAIL;
  if (!apiKey || !recipient) {
    console.error("Contact email delivery is not configured.");
    return NextResponse.json(
      { error: "Message delivery is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Sogakope Rentals <onboarding@resend.dev>",
      to: recipient,
      replyTo: email,
      subject: `New Support Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend failed to deliver a support inquiry:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to send support inquiry email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
