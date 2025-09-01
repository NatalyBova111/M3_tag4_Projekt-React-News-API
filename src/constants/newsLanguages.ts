export const NEWS_LANGUAGES = [
  { code: "ar", label: "العربية" },
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "he", label: "עברית" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "sv", label: "Svenska" },
  { code: "ud", label: "Urdu" },      // так в NewsAPI
  { code: "zh", label: "中文" },
] as const;

export type NewsLanguageCode = typeof NEWS_LANGUAGES[number]["code"];
export const isNewsLanguage = (v: string): v is NewsLanguageCode =>
  NEWS_LANGUAGES.some(l => l.code === v);
