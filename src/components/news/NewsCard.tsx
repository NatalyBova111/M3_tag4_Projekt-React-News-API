import type { Article } from "../../types/news";
import "./NewsCard.css";

type Props = { article: Article };

export default function NewsCard({ article }: Props) {
  return (
    <li className="card">
      {article.urlToImage && (
        <img className="card__thumb" src={article.urlToImage} alt={article.title} />
      )}
      <div className="card__body">
        <a className="card__title" href={article.url} target="_blank" rel="noreferrer">
          {article.title}
        </a>
        {article.description && <p className="card__desc">{article.description}</p>}
        <div className="card__meta">
          <span>{article.source?.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleString()}
          </time>
        </div>
      </div>
    </li>
  );
}
