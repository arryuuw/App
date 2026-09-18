export interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGIN?: string;
}

interface ReflectionRequestBody {
  text?: string;
  mood?: string;
}

// You can swap this for a cheaper model (e.g. "claude-haiku-4-5") once you're
// live and want to control per-reflection API cost.
const CLAUDE_MODEL = 'claude-opus-5';

function corsHeaders(env: Env): HeadersInit {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders(env) });
    }

    let body: ReflectionRequestBody;
    try {
      body = await request.json();
    } catch {
      return jsonError(env, 'Invalid JSON body', 400);
    }

    const text = (body.text ?? '').toString().trim();
    const mood = (body.mood ?? '').toString().trim();

    if (!text) {
      return jsonError(env, 'Missing "text"', 400);
    }
    if (text.length > 4000) {
      return jsonError(env, 'Entry is too long', 400);
    }

    const systemPrompt =
      'You are a warm, concise journaling companion inside a mobile app. ' +
      'Given a journal entry and the mood the writer picked, respond with ' +
      'a short, validating reflection (2-3 sentences, no clichés, no ' +
      'therapy-speak, speak plainly like a thoughtful friend) and one open ' +
      'follow-up question to help them go deeper tomorrow. ' +
      'Respond ONLY with strict JSON: {"reflection": "...", "prompt": "..."}. ' +
      'No markdown, no extra text.';

    const userMessage = `Mood: ${mood || 'unspecified'}\n\nEntry:\n${text}`;

    try {
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text();
        console.error('Anthropic error', anthropicRes.status, errText);
        return jsonError(env, 'AI request failed', 502);
      }

      const data = (await anthropicRes.json()) as {
        content?: { text?: string }[];
      };
      const raw: string = data.content?.[0]?.text ?? '{}';

      let parsed: { reflection?: string; prompt?: string };
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { reflection: raw, prompt: '' };
      }

      return new Response(
        JSON.stringify({
          reflection: parsed.reflection ?? '',
          prompt: parsed.prompt ?? '',
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders(env) } }
      );
    } catch (err) {
      console.error(err);
      return jsonError(env, 'Unexpected error', 500);
    }
  },
};

function jsonError(env: Env, message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}
