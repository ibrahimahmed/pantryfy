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

// ---------------------------------------------------------------------------
// Platform-specific fetchers
// ---------------------------------------------------------------------------

async function fetchYouTubeContent(
  url: string,
  videoId: string
): Promise<{ title: string; description: string; thumbnail?: string }> {
  // 1) Try YouTube oEmbed for the title + thumbnail
  let title = "";
  let thumbnail: string | undefined;
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

  // 2) Fetch the watch page HTML to grab the description
  let description = "";
  try {
    const page = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (page.ok) {
      const html = await page.text();

      // Try to get description from meta tags
      const metaDesc =
        html.match(
          /(?:property|name)="og:description"\s+content="([^"]*?)"/i
        ) ||
        html.match(
          /content="([^"]*?)"\s+(?:property|name)="og:description"/i
        );
      if (metaDesc) {
        description = decodeHtmlEntities(metaDesc[1]);
      }

      // Try the initial player response JSON (has the full description)
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
          if (desc && desc.length > description.length) {
            description = desc;
          }
          if (!title) {
            title = parsed?.videoDetails?.title || title;
          }
        } catch {
          /* ignore parse errors */
        }
      }

      // Also try ytInitialData
      const ytData = html.match(
        /var ytInitialData\s*=\s*(\{[\s\S]*?\});/
      );
      if (ytData && !description) {
        try {
          const text = ytData[1];
          // Look for description snippets
          const descMatch = text.match(
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
        if (titleMatch) {
          title = decodeHtmlEntities(titleMatch[1]).replace(
            / - YouTube$/,
            ""
          );
        }
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

  // 1) oEmbed
  try {
    const oembed = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (oembed.ok) {
      const data = await oembed.json();
      title = data.title || "";
      description = data.title || ""; // TikTok oEmbed title IS the caption
      thumbnail = data.thumbnail_url;
    }
  } catch {
    /* ignore */
  }

  // 2) Fetch page for more detail
  if (!description || description.length < 30) {
    try {
      const page = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (page.ok) {
        const html = await page.text();
        const metaDesc =
          html.match(/property="og:description"\s+content="([^"]*?)"/i) ||
          html.match(/content="([^"]*?)"\s+property="og:description"/i) ||
          html.match(/name="description"\s+content="([^"]*?)"/i);
        if (metaDesc) {
          const decoded = decodeHtmlEntities(metaDesc[1]);
          if (decoded.length > description.length) {
            description = decoded;
          }
        }
        if (!title) {
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          if (titleMatch) title = decodeHtmlEntities(titleMatch[1]);
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
  let description = "";
  let thumbnail: string | undefined;

  try {
    const page = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
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

  return { title: "", description, thumbnail };
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
// Main action
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
      let content: {
        title: string;
        description: string;
        thumbnail?: string;
      };

      if (ytId) {
        content = await fetchYouTubeContent(args.url, ytId);
      } else if (isTikTok) {
        content = await fetchTikTokContent(args.url);
      } else {
        content = await fetchInstagramContent(args.url);
      }

      const platform = ytId ? "YouTube" : isTikTok ? "TikTok" : "Instagram";

      if (!content.description && !content.title) {
        return {
          success: false as const,
          error: `Could not fetch video info from ${platform}. The video may be private or unavailable.`,
        };
      }

      if (!openaiKey) {
        return {
          success: false as const,
          error: `Got the video description but need OPENAI_API_KEY in Convex dashboard to parse the recipe from it.`,
        };
      }

      // Send the video description to OpenAI
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

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error("OpenAI error:", errText);
          return {
            success: false as const,
            error: "AI service error while parsing video recipe",
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
            imageUrl: content.thumbnail || undefined,
            ingredients: parsed.ingredients.map(formatIngredient),
          };
        }

        return {
          success: false as const,
          error: `Could not find recipe ingredients in the ${platform} video description. The recipe may only be spoken in the video.`,
        };
      } catch (e) {
        console.error("Video extraction error:", e);
        return {
          success: false as const,
          error: "Failed to parse recipe from video",
        };
      }
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
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
