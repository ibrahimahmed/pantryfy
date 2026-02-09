import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback, useRef } from "react";

/** Detect if a URL points to a video platform */
function isVideoUrl(url: string): boolean {
  return (
    /youtube\.com|youtu\.be/i.test(url) ||
    /tiktok\.com/i.test(url) ||
    /instagram\.com\/(?:p|reel|reels)\//i.test(url)
  );
}

export function useRecipeExtraction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  const extractAction = useAction(api.extract.extractRecipeFromUrl);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const extract = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      const isVideo = isVideoUrl(url);

      // Show progressive status messages for video analysis
      if (isVideo) {
        setStatus("Fetching video info...");
        timerRef.current = setTimeout(() => {
          setStatus("Analyzing video content with AI...");
          timerRef.current = setTimeout(() => {
            setStatus("Extracting ingredients... Almost done");
          }, 8000);
        }, 4000);
      } else {
        setStatus("Extracting recipe...");
      }

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
        setStatus(null);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [extractAction]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { extract, loading, error, result, reset, status };
}
