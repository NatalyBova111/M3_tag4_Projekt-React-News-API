export type Article = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO
  content: string | null;
};

export type NewsResponse =
  | { status: "ok"; totalResults: number; articles: Article[] }
  | { status: "error"; code?: string; message: string };
