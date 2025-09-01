import type { RefObject } from "react";
import type { Article } from "../../types/news";
import "./NewsGrid.css";
import NewsCard from "./NewsCard";

type Props = {
  articles: Article[];
  sentinelRef?: RefObject<HTMLLIElement | null>; // ← было без | null
};

export default function NewsGrid({ articles, sentinelRef }: Props) {
  if (!articles.length) {
    return <p className="grid__empty">No results. Try another query.</p>;
  }
  return (
    <ul className="grid">
      {articles.map((a) => <NewsCard key={a.url} article={a} />)}
      <li ref={sentinelRef} className="grid__sentinel" aria-hidden="true" />
    </ul>
  );
}

