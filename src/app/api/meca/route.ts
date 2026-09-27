import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * MECA chat endpoint used by the Hero chat panel (POST /api/meca).
 *
 * The system prompt lives here on the server; any `system` sent by the
 * browser is ignored so visitors can't rewrite the assistant's instructions.
 */

const MODEL = "claude-opus-5";

// Public endpoint that spends API credits: keep requests small.
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;

const SYSTEM_PROMPT = `
You are MECA, the AI assistant of MECATRONIX Software Development.

Company:
MECATRONIX is a software development and digital engineering company.

Services include:
- Custom software development
- Web application development
- Business automation
- AI integration
- Industrial software
- Digital platforms
- Mobile applications
- Enterprise systems

Personality:
- Professional
- Friendly
- Futuristic
- Concise
- Helpful

Keep most responses to 2-4 short sentences.

When a user asks to see work or projects:
Direct them to /portfolio.

When a user wants to start a project:
Direct them to /openline.

Do not claim capabilities or company information that has not been provided.

Latency-sensitive; begin your visible answer immediately.
`.trim();

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

/** Keep only well-formed user/assistant text turns, trimmed to the limits above. */
function sanitizeMessages(input: unknown): Anthropic.Beta.BetaMessageParam[] {
  if (!Array.isArray(input)) return [];

  const cleaned = input
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_CHARS_PER_MESSAGE),
    }))
    .slice(-MAX_MESSAGES);

  // The conversation must start with a user turn (the UI opens with a greeting)
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();

  return cleaned;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);

  if (!messages.length) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "MECA is not configured" }, { status: 503 });
  }

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages,
      // Short chat replies: low effort keeps latency and cost down
      output_config: { effort: "low" },
      // If the model declines on policy grounds, let the API retry on its recommended fallback
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply: "I can't help with that one, but I'm happy to talk about MECATRONIX services or your next project.",
      });
    }

    const reply =
      response.content
        .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
        .map((block) => block.text)
        .join("")
        .trim() || "MECA could not generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "MECA is busy, please try again shortly" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`MECA API error ${error.status}:`, error.message);
      return NextResponse.json({ error: "MECA AI request failed" }, { status: 502 });
    }
    console.error("MECA route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
