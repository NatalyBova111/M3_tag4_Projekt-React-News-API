import "./SearchBar.css";
import { NEWS_LANGUAGES, type NewsLanguageCode } from "../../constants/newsLanguages";

type Props = {
  value: string;
  language: NewsLanguageCode;
  onChangeValue: (v: string) => void;
  onChangeLanguage: (v: NewsLanguageCode) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, language, onChangeValue, onChangeLanguage, onSubmit }: Props) {
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(); };

  return (
    <form className="search" onSubmit={submit}>
      <input
        className="search__input"
        placeholder="Type to search..."
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
      />

      <select
        className="search__select"
        value={language}
        onChange={(e) => onChangeLanguage(e.target.value as NewsLanguageCode)}
        aria-label="Select your language"
      >
        {NEWS_LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>

      <button className="search__button" type="submit">Search</button>
    </form>
  );
}
