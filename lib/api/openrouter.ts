import { DreamAnalysis } from "@/types/dream";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function analyzeDream(
  dreamContent: string,
  apiKey: string,
): Promise<DreamAnalysis> {
  const systemPrompt = `You are a dream analyst. Analyze the dream and return a JSON response with the following structure:
{
  "summary": "Brief essence of the dream",
  "characters": [
    {
      "name": "Character name",
      "description": "Brief description",
      "role": "Role in the story"
    }
  ],
  "locations": [
    {
      "name": "Location name",
      "description": "Description",
      "type": "indoor/outdoor/abstract/familiar"
    }
  ],
  "mood": "Emotional tone",
  "themes": ["theme1", "theme2"],
  "patterns": [
    {
      "type": "recurring/symbolic/emotional",
      "description": "Pattern description",
      "significance": "Why this matters"
    }
  ],
  "insights": "Psychological interpretation"
}

Be concise and insightful. Return only valid JSON.`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Dream Analyzer",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: dreamContent },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0].message.content;

  try {
    const analysis = JSON.parse(content);
    return analysis as DreamAnalysis;
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}
