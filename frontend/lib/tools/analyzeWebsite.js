import { z } from "zod";

export const analyzeWebsiteTool = {
  description:
    "Analyze a website URL and return basic metadata and page findings.",

  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The full URL of the website to analyze."),
  }),

  execute: async ({ url }) => {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FE07-Website-Analyzer/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Website returned HTTP ${response.status}.`
      );
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descriptionMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );

    const title = titleMatch?.[1]?.trim() || "No title found";
    const description =
      descriptionMatch?.[1]?.trim() || "No meta description found";

    return {
      url,
      title,
      description,
      titleFound: Boolean(titleMatch),
      descriptionFound: Boolean(descriptionMatch),
      analyzedAt: new Date().toISOString(),
    };
  },
};