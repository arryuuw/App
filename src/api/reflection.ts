// URL of the Cloudflare Worker proxy (see /worker). Set after you deploy it.
const REFLECTION_API_URL = process.env.EXPO_PUBLIC_REFLECTION_API_URL ?? '';

export interface ReflectionResult {
  reflection: string;
  prompt: string;
}

export async function getReflection(
  text: string,
  mood: string
): Promise<ReflectionResult> {
  if (!REFLECTION_API_URL) {
    throw new Error(
      'AI reflections are not configured yet. Set EXPO_PUBLIC_REFLECTION_API_URL to your deployed worker URL.'
    );
  }

  const res = await fetch(REFLECTION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, mood }),
  });

  if (!res.ok) {
    throw new Error(`Reflection request failed (${res.status})`);
  }

  const data = await res.json();
  return { reflection: data.reflection, prompt: data.prompt };
}
