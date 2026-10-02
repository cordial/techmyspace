"use client";

import { useState, type FormEvent } from "react";

import type { Service } from "@/lib/types";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({
  services,
}: {
  services: Pick<Service, "slug" | "title">[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(
        payload?.error ||
          "Something went wrong. Call us and we will pick it up.",
      );
      setStatus("error");
    } catch {
      setError("Something went wrong. Call us and we will pick it up.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 border border-white/10 bg-charcoal p-6 md:p-8"
    >
      <label className="grid gap-2 text-sm text-muted">
        Name
        <input
          name="name"
          required
          autoComplete="name"
          className="border border-white/15 bg-ink px-3 py-3 text-cream"
        />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border border-white/15 bg-ink px-3 py-3 text-cream"
        />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        Phone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          className="border border-white/15 bg-ink px-3 py-3 text-cream"
        />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        Service
        <select
          name="service"
          defaultValue=""
          className="border border-white/15 bg-ink px-3 py-3 text-cream"
        >
          <option value="">Not sure yet</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm text-muted">
        How can we help?
        <textarea
          name="message"
          required
          rows={5}
          className="border border-white/15 bg-ink px-3 py-3 text-cream"
        />
      </label>
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-yellow px-5 py-3 font-display text-sm tracking-[0.14em] text-ink uppercase disabled:opacity-60"
      >
        {status === "sending" ? "Sending" : "Send message"}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-cream">
          Message sent. We will come back to you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-orange">{error}</p>
      ) : null}
    </form>
  );
}
