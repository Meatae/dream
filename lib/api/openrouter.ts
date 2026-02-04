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
  const systemPrompt = `Ты - опытный аналитик снов с глубоким знанием психологии и символики. Проанализируй сон подробно и верни JSON ответ на русском языке:

{
  "summary": "Подробное описание сюжета сна (3-5 предложений), что происходило, ключевые события и повороты",
  "characters": [
    {
      "name": "Имя персонажа или описание",
      "description": "Детальное описание внешности, поведения и особенностей персонажа",
      "role": "Роль в сюжете и символическое значение"
    }
  ],
  "locations": [
    {
      "name": "Название места действия",
      "description": "Детальное описание атмосферы, деталей и настроения места",
      "type": "indoor/outdoor/abstract/familiar"
    }
  ],
  "mood": "Эмоциональный тон сна (подробно: чувства и атмосферу)",
  "themes": ["тема1", "тема2", "тема3"],
  "patterns": [
    {
      "type": "recurring/symbolic/emotional",
      "description": "Детальное описание паттерна или символа",
      "significance": "Почему это важно и как связано с психологией сновидца"
    }
  ],
  "insights": "Глубокий психологический анализ: что сон говорит о подсознательных мыслях, страхах, желаниях или процессах. Связи с реальной жизнью и возможные интерпретации (4-6 предложений)"
}

Анализируй глубоко и детально. Возвращай только валидный JSON.`;

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
