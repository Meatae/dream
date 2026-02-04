import { useState } from 'react';
import { analyzeDream } from '@/lib/api/openrouter';
import { DreamAnalysis } from '@/types/dream';

export function useAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (content: string, apiKey: string): Promise<DreamAnalysis> => {
    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeDream(content, apiKey);
      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze dream';
      setError(message);
      throw new Error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzing,
    error,
    analyze
  };
}
