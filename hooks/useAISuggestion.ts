import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback } from "react";

interface AISuggestion {
  dish: string;
  reason: string;
  tip: string;
}

export function useAISuggestion() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = useAction(api.ai.getSmartSuggestion);

  const fetchSuggestion = useCallback(
    async (ingredients: string[]) => {
      if (ingredients.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getSuggestion({ ingredients });
        setSuggestion(result as AISuggestion);
      } catch (e) {
        setError("Could not get AI suggestion");
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [getSuggestion]
  );

  const reset = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  return { fetchSuggestion, loading, suggestion, error, reset };
}
