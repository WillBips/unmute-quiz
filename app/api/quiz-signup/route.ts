import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type QuizSignupPayload = {
  email?: unknown;
  profile?: unknown;
  locale?: unknown;
  scores?: unknown;
  answers?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toNonEmptyString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getRequiredEnv(name: "MAILCHIMP_API_KEY" | "MAILCHIMP_SERVER_PREFIX" | "MAILCHIMP_LIST_ID") {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

export async function POST(request: Request) {
  let payload: QuizSignupPayload;

  try {
    payload = (await request.json()) as QuizSignupPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const email = toNonEmptyString(payload.email);
  const profile = toNonEmptyString(payload.profile);
  const locale = toNonEmptyString(payload.locale) ?? "";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 },
    );
  }

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Missing profile" },
      { status: 400 },
    );
  }

  const apiKey = getRequiredEnv("MAILCHIMP_API_KEY");
  const serverPrefix = getRequiredEnv("MAILCHIMP_SERVER_PREFIX");
  const listId = getRequiredEnv("MAILCHIMP_LIST_ID");

  if (!apiKey || !serverPrefix || !listId) {
    return NextResponse.json(
      { ok: false, error: "Mailchimp is not configured" },
      { status: 500 },
    );
  }

  const normalizedEmail = email.toLowerCase();
  const memberHash = createHash("md5").update(normalizedEmail).digest("hex");
  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${memberHash}`;
  const authToken = Buffer.from(`anystring:${apiKey}`).toString("base64");

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        status: "subscribed",
        tags: ["quiz", `profile:${profile}`],
        merge_fields: {
          PROFILE: profile,
          LOCALE: locale,
        },
      }),
    });

    if (!response.ok) {
      let errorMessage = `Mailchimp request failed (${response.status})`;
      try {
        const data = (await response.json()) as { detail?: unknown; title?: unknown };
        if (typeof data.detail === "string" && data.detail.trim().length > 0) {
          errorMessage = data.detail;
        } else if (typeof data.title === "string" && data.title.trim().length > 0) {
          errorMessage = data.title;
        }
      } catch {
        // Keep default error message when response body is not JSON.
      }

      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to reach Mailchimp" },
      { status: 502 },
    );
  }
}
