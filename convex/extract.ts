import { action } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// URL detection helpers
// ---------------------------------------------------------------------------

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function isTikTokUrl(url: string): boolean {
  return /tiktok\.com/.test(url);
}

function isInstagramUrl(url: string): boolean {
  return /instagram\.com\/(?:p|reel|reels)\//.test(url);
}

function getInstagramShortcode(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/
  );
  return match ? match[1] : null;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ---------------------------------------------------------------------------
// Platform-specific text/metadata fetchers
// ---------------------------------------------------------------------------

async function fetchYouTubeContent(
  url: string,
  videoId: string
): Promise<{ title: string; description: string; thumbnail?: string }> {
  let title = "";
  let thumbnail: string | undefined;
  let description = "";

  // 1) oEmbed for title + thumbnail
  try {
    const oembed = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (oembed.ok) {
      const data = await oembed.json();
      title = data.title || "";
      thumbnail = data.thumbnail_url;
    }
  } catch {
    /* ignore */
  }

  // 2) Fetch watch page HTML for the description
  try {
    const page = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA, "Accept-Language": "en-US,en;q=0.9" },
    });
    if (page.ok) {
      const html = await page.text();

      // Meta og:description
      const metaDesc =
        html.match(
          /(?:property|name)="og:description"\s+content="([^"]*?)"/i
        ) ||
        html.match(
          /content="([^"]*?)"\s+(?:property|name)="og:description"/i
        );
      if (metaDesc) description = decodeHtmlEntities(metaDesc[1]);

      // ytInitialPlayerResponse (full description)
      const ytInitial = html.match(
        /var ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/
      );
      if (ytInitial) {
        try {
          const parsed = JSON.parse(ytInitial[1]);
          const desc =
            parsed?.videoDetails?.shortDescription ||
            parsed?.microformat?.playerMicroformatRenderer?.description
              ?.simpleText;
          if (desc && desc.length > description.length) description = desc;
          if (!title) title = parsed?.videoDetails?.title || title;
        } catch {
          /* ignore */
        }
      }

      // ytInitialData fallback
      const ytData = html.match(/var ytInitialData\s*=\s*(\{[\s\S]*?\});/);
      if (ytData && !description) {
        try {
          const descMatch = ytData[1].match(
            /"description":\{"simpleText":"([\s\S]*?)"\}/
          );
          if (descMatch) {
            description = descMatch[1]
              .replace(/\\n/g, "\n")
              .replace(/\\"/g, '"');
          }
        } catch {
          /* ignore */
        }
      }

      if (!title) {
        const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
        if (titleMatch)
          title = decodeHtmlEntities(titleMatch[1]).replace(/ - YouTube$/, "");
      }
    }
  } catch {
    /* ignore */
  }

  return { title, description, thumbnail };
}

async function fetchTikTokContent(
  url: string
): Promise<{ title: string; description: string; thumbnail?: string }> {
  let title = "";
  let description = "";
  let thumbnail: string | undefined;

  // 1) oEmbed (TikTok title = caption)
  try {
    const oembed = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (oembed.ok) {
      const data = await oembed.json();
      title = data.title || "";
      description = data.title || "";
      thumbnail = data.thumbnail_url;
    }
  } catch {
    /* ignore */
  }

  // 2) Page HTML for more detail
  if (!description || description.length < 30) {
    try {
      const page = await fetch(url, {
        headers: { "User-Agent": BROWSER_UA, "Accept-Language": "en-US,en;q=0.9" },
      });
      if (page.ok) {
        const html = await page.text();
        const metaDesc =
          html.match(/property="og:description"\s+content="([^"]*?)"/i) ||
          html.match(/content="([^"]*?)"\s+property="og:description"/i) ||
          html.match(/name="description"\s+content="([^"]*?)"/i);
        if (metaDesc) {
          const decoded = decodeHtmlEntities(metaDesc[1]);
          if (decoded.length > description.length) description = decoded;
        }
        if (!title) {
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          if (titleMatch) title = decodeHtmlEntities(titleMatch[1]);
        }
        if (!thumbnail) {
          const ogImage =
            html.match(/property="og:image"\s+content="([^"]*?)"/i) ||
            html.match(/content="([^"]*?)"\s+property="og:image"/i);
          if (ogImage) thumbnail = ogImage[1];
        }
      }
    } catch {
      /* ignore */
    }
  }

  return { title, description, thumbnail };
}

async function fetchInstagramContent(
  url: string
): Promise<{ title: string; description: string; thumbnail?: string }> {
  let title = "";
  let description = "";
  let thumbnail: string | undefined;

  // 1) Instagram oEmbed API (works for some public posts)
  try {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
    const oembed = await fetch(oembedUrl, {
      headers: { "User-Agent": BROWSER_UA },
    });
    if (oembed.ok) {
      const data = await oembed.json();
      title = data.author_name ? `Recipe by ${data.author_name}` : "";
      // oEmbed title usually contains the caption
      if (data.title) {
        description = data.title;
        if (!title) title = data.title.slice(0, 60);
      }
      thumbnail = data.thumbnail_url;
    }
  } catch {
    /* ignore */
  }

  // 2) Try the captioned embed page
  if (!description || !thumbnail) {
    const shortcode = getInstagramShortcode(url);
    if (shortcode) {
      try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const page = await fetch(embedUrl, {
          headers: {
            "User-Agent": BROWSER_UA,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        if (page.ok) {
          const html = await page.text();
          // Caption from embed page
          if (!description) {
            const captionMatch = html.match(
              /class="Caption"[^>]*>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/i
            );
            if (captionMatch) {
              description = captionMatch[1]
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            }
          }
          // Image from embed page
          if (!thumbnail) {
            const imgMatch =
              html.match(
                /class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i
              ) ||
              html.match(/property="og:image"\s+content="([^"]+)"/i) ||
              html.match(/content="([^"]+)"\s+property="og:image"/i);
            if (imgMatch) thumbnail = imgMatch[1];
          }
        }
      } catch {
        /* ignore */
      }
    }
  }

  // 3) Fallback: direct page fetch (Instagram usually blocks this)
  if (!description && !thumbnail) {
    try {
      const page = await fetch(url, {
        headers: {
          "User-Agent": BROWSER_UA,
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });
      if (page.ok) {
        const html = await page.text();
        const metaDesc =
          html.match(/property="og:description"\s+content="([^"]*?)"/i) ||
          html.match(/content="([^"]*?)"\s+property="og:description"/i);
        if (metaDesc) description = decodeHtmlEntities(metaDesc[1]);
        const ogImage =
          html.match(/property="og:image"\s+content="([^"]*?)"/i) ||
          html.match(/content="([^"]*?)"\s+property="og:image"/i);
        if (ogImage) thumbnail = ogImage[1];
      }
    } catch {
      /* ignore */
    }
  }

  return { title, description, thumbnail };
}

// ---------------------------------------------------------------------------
// Thumbnail helpers
// ---------------------------------------------------------------------------

/** YouTube CDN provides auto-generated thumbnails at different video timestamps */
function getYouTubeThumbnailUrls(videoId: string): string[] {
  return [
    // High-quality default thumbnail (always available)
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    // Auto-generated frames at ~25%, 50%, 75% of video duration
    `https://img.youtube.com/vi/${videoId}/1.jpg`,
    `https://img.youtube.com/vi/${videoId}/2.jpg`,
    `https://img.youtube.com/vi/${videoId}/3.jpg`,
  ];
}

/** Verify which thumbnail URLs actually resolve (filter out 404s) */
async function filterValidThumbnails(urls: string[]): Promise<string[]> {
  const checks = urls.map(async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {
      /* skip */
    }
    return null;
  });
  const results = await Promise.all(checks);
  return results.filter((u): u is string => u !== null);
}

// ---------------------------------------------------------------------------
// AI: Text-based recipe extraction (GPT-4o-mini -- fast, cheap)
// ---------------------------------------------------------------------------

async function extractRecipeFromText(
  openaiKey: string,
  content: { title: string; description: string },
  platform: string
): Promise<{
  title: string;
  servings: number;
  ingredients: Array<{ name: string; quantity: number; unit: string; raw: string }>;
} | null> {
  const prompt = `This is the title and description from a ${platform} cooking video:

Title: ${content.title}

Description/Caption:
${content.description.slice(0, 6000)}

Extract the recipe from this video description. The ingredients and amounts are usually listed in the description or caption. If amounts are not specified, estimate reasonable quantities for 4 servings.

Return JSON only:
{
  "title": "recipe name",
  "servings": 4,
  "ingredients": [
    {"name": "flour", "quantity": 2, "unit": "cups", "raw": "2 cups all-purpose flour"}
  ]
}`;

  try {
    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a recipe extraction assistant. Extract recipe ingredients from video descriptions. If the description lists ingredients, use those exact amounts. If only ingredient names are mentioned without amounts, estimate reasonable quantities for a home cook. Always return valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
        }),
      }
    );

    if (!aiResponse.ok) return null;

    const aiData = await aiResponse.json();
    const parsed = JSON.parse(aiData.choices[0].message.content || "{}");

    if (parsed.title && parsed.ingredients?.length > 0) {
      return {
        title: parsed.title,
        servings: parsed.servings || 4,
        ingredients: parsed.ingredients,
      };
    }
  } catch (e) {
    console.error("Text extraction AI error:", e);
  }

  return null;
}

// ---------------------------------------------------------------------------
// AI: Vision-based recipe extraction (GPT-4o -- best vision accuracy)
// ---------------------------------------------------------------------------

async function extractRecipeFromVision(
  openaiKey: string,
  thumbnailUrls: string[],
  textContext: { title: string; description: string },
  platform: string
): Promise<{
  title: string;
  servings: number;
  ingredients: Array<{ name: string; quantity: number; unit: string; raw: string }>;
} | null> {
  if (thumbnailUrls.length === 0) return null;

  // Build multi-modal content array
  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail: string } }
  > = [];

  // Add text context if available
  const hasText = textContext.title || textContext.description;
  if (hasText) {
    userContent.push({
      type: "text",
      text: `I'm extracting a recipe from a ${platform} cooking video.\n\nVideo title: ${textContext.title || "Unknown"}\nCaption/Description: ${textContext.description?.slice(0, 2000) || "Not available"}\n\nBelow are frames/thumbnails from the video. Analyze them carefully to identify the dish and ALL ingredients used:`,
    });
  } else {
    userContent.push({
      type: "text",
      text: `I'm extracting a recipe from a ${platform} cooking video. No caption or description was available.\n\nBelow are frames/thumbnails from the video. Analyze them carefully to identify the dish being prepared and extract ALL ingredients you can see or infer:`,
    });
  }

  // Add thumbnail images (up to 4)
  for (const url of thumbnailUrls.slice(0, 4)) {
    userContent.push({
      type: "image_url",
      image_url: { url, detail: "high" },
    });
  }

  // Request structured output
  userContent.push({
    type: "text",
    text: `Based on the video frames above, identify:
1. What dish is being prepared
2. Every ingredient visible or clearly implied (proteins, vegetables, grains, spices, oils, sauces, garnishes)
3. Estimate realistic quantities for each ingredient

Be thorough -- include seasonings, oils, and garnishes you can see or that would logically be used.

Return JSON only:
{
  "title": "recipe name",
  "servings": 4,
  "ingredients": [
    {"name": "ingredient name", "quantity": 2, "unit": "cups", "raw": "2 cups ingredient"}
  ]
}`,
  });

  try {
    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert chef and recipe analyst with perfect visual recognition. You analyze cooking video frames to identify dishes and extract complete ingredient lists. You never miss an ingredient -- you identify main components, seasonings, oils, sauces, and garnishes. You estimate accurate quantities based on visual cues. Always return valid JSON.",
            },
            { role: "user", content: userContent },
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Vision API error:", errText);
      return null;
    }

    const aiData = await aiResponse.json();
    const parsed = JSON.parse(aiData.choices[0].message.content || "{}");

    if (parsed.title && parsed.ingredients?.length > 0) {
      return {
        title: parsed.title,
        servings: parsed.servings || 4,
        ingredients: parsed.ingredients,
      };
    }
  } catch (e) {
    console.error("Vision extraction error:", e);
  }

  return null;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function formatIngredient(i: any) {
  return {
    name: i.name || "unknown",
    quantity: typeof i.quantity === "number" ? i.quantity : 0,
    unit: i.unit || "",
    raw:
      i.raw ||
      `${i.quantity || ""} ${i.unit || ""} ${i.name || ""}`.trim(),
  };
}

// ---------------------------------------------------------------------------
// Main action -- multi-stage extraction pipeline
// ---------------------------------------------------------------------------

export const extractRecipeFromUrl = action({
  args: { url: v.string() },
  handler: async (_ctx, args) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const spoonacularKey = process.env.SPOONACULAR_API_KEY;

    // ------------------------------------------------------------------
    // Path A: Video platforms (YouTube, TikTok, Instagram Reels)
    // ------------------------------------------------------------------
    const ytId = getYouTubeVideoId(args.url);
    const isTikTok = isTikTokUrl(args.url);
    const isInsta = isInstagramUrl(args.url);

    if (ytId || isTikTok || isInsta) {
      if (!openaiKey) {
        return {
          success: false as const,
          error:
            "Add OPENAI_API_KEY in the Convex dashboard to enable video recipe extraction.",
        };
      }

      const platform = ytId ? "YouTube" : isTikTok ? "TikTok" : "Instagram";

      // ── Stage 1: Fetch text metadata ──────────────────────────────
      let content: { title: string; description: string; thumbnail?: string };

      if (ytId) {
        content = await fetchYouTubeContent(args.url, ytId);
      } else if (isTikTok) {
        content = await fetchTikTokContent(args.url);
      } else {
        content = await fetchInstagramContent(args.url);
      }

      // ── Stage 2: Try text-based extraction if we have description ─
      if (content.description && content.description.length > 20) {
        const textResult = await extractRecipeFromText(
          openaiKey,
          content,
          platform
        );
        if (textResult) {
          return {
            success: true as const,
            source: "ai" as const,
            title: textResult.title,
            servings: textResult.servings,
            imageUrl: content.thumbnail || undefined,
            ingredients: textResult.ingredients.map(formatIngredient),
          };
        }
      }

      // ── Stage 3: Collect thumbnails for vision analysis ───────────
      const thumbnailUrls: string[] = [];

      // YouTube always has CDN thumbnails (multiple frames)
      if (ytId) {
        const ytThumbnails = getYouTubeThumbnailUrls(ytId);
        const valid = await filterValidThumbnails(ytThumbnails);
        thumbnailUrls.push(...valid);
      }

      // Add platform thumbnail from metadata (if not already included)
      if (content.thumbnail) {
        thumbnailUrls.push(content.thumbnail);
      }

      // ── Stage 4: Vision-based extraction on thumbnails ────────────
      if (thumbnailUrls.length > 0) {
        const visionResult = await extractRecipeFromVision(
          openaiKey,
          thumbnailUrls,
          { title: content.title, description: content.description },
          platform
        );
        if (visionResult) {
          return {
            success: true as const,
            source: "ai" as const,
            title: visionResult.title,
            servings: visionResult.servings,
            imageUrl: content.thumbnail || thumbnailUrls[0] || undefined,
            ingredients: visionResult.ingredients.map(formatIngredient),
          };
        }
      }

      // ── Stage 5: All automated methods failed ─────────────────────
      const tips =
        platform === "Instagram"
          ? "Instagram often blocks automated access. Try copying the recipe caption and using the Manual tab instead."
          : `Could not extract the recipe from this ${platform} video. The recipe may only be spoken in the video. Try using the Manual tab instead.`;

      return {
        success: false as const,
        error: tips,
      };
    }

    // ------------------------------------------------------------------
    // Path B: Regular recipe website -- try Spoonacular first
    // ------------------------------------------------------------------
    if (spoonacularKey) {
      try {
        const spoonResponse = await fetch(
          `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(args.url)}&apiKey=${spoonacularKey}&analyze=true&forceExtraction=true`
        );

        if (spoonResponse.ok) {
          const data = await spoonResponse.json();
          if (data.title && data.extendedIngredients?.length > 0) {
            return {
              success: true as const,
              source: "spoonacular" as const,
              title: data.title,
              imageUrl: data.image || undefined,
              servings: data.servings || 4,
              ingredients: data.extendedIngredients.map((i: any) => ({
                name: i.name || i.originalName || "unknown",
                quantity: i.amount || 0,
                unit: i.unit || "",
                raw:
                  i.original ||
                  `${i.amount || ""} ${i.unit || ""} ${i.name || ""}`.trim(),
              })),
            };
          }
        }
      } catch (e) {
        console.log("Spoonacular extraction failed, trying OpenAI fallback");
      }
    }

    // ------------------------------------------------------------------
    // Path C: Fetch page HTML + send to OpenAI
    // ------------------------------------------------------------------
    if (openaiKey) {
      try {
        const pageResponse = await fetch(args.url, {
          headers: {
            "User-Agent": BROWSER_UA,
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });

        if (!pageResponse.ok) {
          return {
            success: false as const,
            error: `Could not fetch URL (HTTP ${pageResponse.status})`,
          };
        }

        const html = await pageResponse.text();

        // Look for JSON-LD recipe data first
        const jsonLdMatch = html.match(
          /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
        );
        let jsonLdRecipe = "";
        if (jsonLdMatch) {
          for (const match of jsonLdMatch) {
            const content = match
              .replace(/<script[^>]*>/i, "")
              .replace(/<\/script>/i, "")
              .trim();
            if (
              content.includes("Recipe") ||
              content.includes("recipe")
            ) {
              jsonLdRecipe = content.slice(0, 5000);
              break;
            }
          }
        }

        // Strip HTML for plain text fallback
        const textContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<nav[\s\S]*?<\/nav>/gi, "")
          .replace(/<footer[\s\S]*?<\/footer>/gi, "")
          .replace(/<header[\s\S]*?<\/header>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&[a-z]+;/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 6000);

        const prompt = jsonLdRecipe
          ? `Extract the recipe from this JSON-LD structured data found on ${args.url}:\n\n${jsonLdRecipe}`
          : `Extract the recipe from this web page content (${args.url}):\n\n${textContent}\n\nFind the recipe title and ingredients. Ignore navigation, ads, non-recipe content.`;

        const aiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a recipe extraction assistant. Extract recipe data from the provided content. Return valid JSON only.",
                },
                {
                  role: "user",
                  content:
                    prompt +
                    `\n\nReturn JSON only:\n{"title": "recipe name", "servings": 4, "ingredients": [{"name": "flour", "quantity": 2, "unit": "cups", "raw": "2 cups all-purpose flour"}]}`,
                },
              ],
              response_format: { type: "json_object" },
              max_tokens: 1500,
            }),
          }
        );

        if (!aiResponse.ok) {
          return {
            success: false as const,
            error: "AI extraction service error",
          };
        }

        const aiData = await aiResponse.json();
        const parsed = JSON.parse(
          aiData.choices[0].message.content || "{}"
        );

        if (parsed.title && parsed.ingredients?.length > 0) {
          return {
            success: true as const,
            source: "ai" as const,
            title: parsed.title,
            servings: parsed.servings || 4,
            imageUrl: undefined,
            ingredients: parsed.ingredients.map(formatIngredient),
          };
        }

        return {
          success: false as const,
          error: "Could not find recipe content on that page",
        };
      } catch (e) {
        console.error("Page extraction error:", e);
        return {
          success: false as const,
          error: "Failed to extract recipe from URL",
        };
      }
    }

    return {
      success: false as const,
      error:
        "Add OPENAI_API_KEY in the Convex dashboard (Settings > Environment Variables) to enable recipe extraction.",
    };
  },
});
