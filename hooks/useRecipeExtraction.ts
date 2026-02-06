import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback } from "react";

export function useRecipeExtraction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const extractAction = useAction(api.extract.extractRecipeFromUrl);

  const extract = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await extractAction({ url });
        if (data.success) {
          setResult(data);
        } else {
          setError((data as any).error || "Extraction failed");
        }
      } catch (e) {
        setError("Failed to extract recipe");
      } finally {
        setLoading(false);
      }
    },
    [extractAction]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { extract, loading, error, result, reset };
}
