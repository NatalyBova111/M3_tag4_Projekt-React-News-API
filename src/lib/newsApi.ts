// ВАЖНО: http, чтобы не словить corsNotAllowed
const BASE = "http://newsapi.org/v2/everything";

export function buildEverythingUrl(params: {
  q: string;
  language: string;
  apiKey: string;
  page?: number;              
  pageSize?: number;
  sortBy?: "publishedAt" | "relevancy" | "popularity";
}) {
  const {
    q,
    language,
    apiKey,
    page = 1,                 // ← по умолчанию 1
    pageSize = 20,
    sortBy = "publishedAt",
  } = params;

  const usp = new URLSearchParams({
    q: q || "news",           // без encodeURIComponent — URLSearchParams сам кодирует
    language,
    page: String(page),       // 
    pageSize: String(pageSize),
    sortBy,
    apiKey,
  });

  return `${BASE}?${usp.toString()}`;
}
