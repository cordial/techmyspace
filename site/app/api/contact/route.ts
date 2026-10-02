import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const json: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form and try again." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO?.trim();
  const from =
    process.env.CONTACT_FROM?.trim() || "Tech My Space <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured. Set RESEND_API_KEY and CONTACT_TO, or call 07815 133771.",
      },
      { status: 503 },
    );
  }

  const { name, email, phone, service, message } = parsed.data;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        `Service: ${service || "—"}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "The message could not be sent. Call 07815 133771." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
