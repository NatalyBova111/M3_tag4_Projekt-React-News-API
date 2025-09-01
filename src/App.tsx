import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

import Header from "./components/header/Header";
import SearchBar from "./components/search/SearchBar";
import NewsGrid from "./components/news/NewsGrid";

import type { Article, NewsResponse } from "./types/news";
import { buildEverythingUrl } from "./lib/newsApi";

import type { NewsLanguageCode } from "./constants/newsLanguages";
import { isNewsLanguage } from "./constants/newsLanguages";

export default function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("breaking news");

  const [lang, setLang] = useState<NewsLanguageCode>("en");
  const safeLang: NewsLanguageCode = isNewsLanguage(lang) ? lang : "en";

  const [articles, setArticles] = useState<Article[]>([]);
  const [buffer, setBuffer] = useState<Article[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
  const [pendingAddAfterFetch, setPendingAddAfterFetch] = useState(false);

  const pageSize = 20;
const MAX_RESULTS = 100;
const maxPages = Math.ceil(MAX_RESULTS / pageSize);



  const endpoint = useMemo(() => {
    return buildEverythingUrl({
      q: query,
      language: safeLang,
      apiKey: apiKey ?? "",
      page,
      pageSize,
      sortBy: "publishedAt",
    });
  }, [query, safeLang, apiKey, page]);

  const sentinelRef = useRef<HTMLLIElement | null>(null);

  // fetch page into buffer
  useEffect(() => {
    if (!apiKey) {
      setError("Add VITE_NEWS_API_KEY to .env and restart the dev server.");
      return;
    }

    let cancel = false;

    const loadPage = async () => {
      try {
        setLoadingPage(true);
        setError(null);

        const res = await fetch(endpoint);
        const data: NewsResponse = await res.json();
        if (cancel) return;

        if (data.status === "ok") {
          setHasMore(data.articles.length === pageSize);
          setBuffer((prev) => {
            const seen = new Set(prev.map((a) => a.url));
            const fresh = data.articles.filter((a) => !seen.has(a.url));
            return [...prev, ...fresh];
          });

          setArticles((prev) => {
            if (prev.length === 0 && data.articles.length > 0) {
              const [first, ...rest] = data.articles;
              setBuffer((b) => [...b, ...rest]);
              return [first];
            }
            return prev;
          });
        } else {
          throw new Error(data.message || "Failed to load news.");
        }
      } catch (e: any) {
        if (!cancel) {
          setError(e?.message ?? "Unknown error.");
          setHasMore(false);
        }
      } finally {
        if (!cancel) setLoadingPage(false);
      }
    };

    loadPage();
    return () => {
      cancel = true;
    };
  }, [endpoint, apiKey, page, pageSize]);

  // reset on query/lang change
  useEffect(() => {
    setArticles([]);
    setBuffer([]);
    setPage(1);
    setHasMore(true);
    setPendingAddAfterFetch(false);
  }, [query, safeLang]);

  const addOneFromBuffer = () => {
    setBuffer((prev) => {
      if (!prev.length) return prev;
      const [first, ...rest] = prev;
      setArticles((a) => [...a, first]);
      return rest;
    });
  };

const requestNextPageAndQueueAdd = () => {
  if (!hasMore || loadingPage) return;
  // если уже показали/запросили 100 и буфер пуст — больше не грузим
  if (page >= maxPages && buffer.length === 0) {
    setHasMore(false);
    return;
  }
  setPendingAddAfterFetch(true);
  setPage((p) => p + 1);
};




  useEffect(() => {
    if (pendingAddAfterFetch && buffer.length > 0) {
      addOneFromBuffer();
      setPendingAddAfterFetch(false);
    }
  }, [buffer.length, pendingAddAfterFetch]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;

        if (buffer.length > 0) addOneFromBuffer();
        else requestNextPageAndQueueAdd();
      },
      { root: null, rootMargin: "200px 0px 200px 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [buffer.length, hasMore, loadingPage]);

  const handleSubmit = () => setQuery(input.trim() || "news");

  return (
    <>
      <Header />
      <SearchBar
        value={input}
        language={lang}
        onChangeValue={setInput}
        onChangeLanguage={setLang}
        onSubmit={handleSubmit}
      />

      <div style={{ maxWidth: 1050, margin: "0 auto", padding: "0 16px" }}>
        <hr style={{ border: "none", borderTop: "1px solid #d8cfcf", margin: "14px 0 20px" }} />
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
      </div>

      <NewsGrid articles={articles} sentinelRef={sentinelRef} />

      {loadingPage && (
        <p style={{ textAlign: "center", color: "#666", margin: "8px 0 24px" }}>
          Loading more…
        </p>
      )}
      {!hasMore && (
        <p style={{ textAlign: "center", color: "#666", margin: "8px 0 24px" }}>
          You’ve reached the end.
        </p>
      )}
    </>
  );
}
