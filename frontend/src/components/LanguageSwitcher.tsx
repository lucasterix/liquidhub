import { useLanguage, Lang } from '../i18n/useLanguage';
import { useT } from '../i18n/translations';

export default function LanguageSwitcher() {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);
  const t = useT();

  const options: { code: Lang; label: string; flag: string }[] = [
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <div className="lang-switcher" role="group" aria-label={t('header.languageTitle')}>
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          className={`lang-chip${opt.code === lang ? ' active' : ''}`}
          onClick={() => setLang(opt.code)}
          aria-pressed={opt.code === lang}
          title={opt.code.toUpperCase()}
        >
          <span aria-hidden>{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
