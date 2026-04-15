import { useT } from '../i18n/translations';

export default function AboutSection() {
  const t = useT();
  return (
    <section className="about-section" aria-labelledby="about-heading">
      <header className="about-header">
        <h2 id="about-heading">{t('about.title')}</h2>
        <p className="about-lead">{t('about.lead')}</p>
      </header>

      <div className="about-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <article key={i}>
            <h3>{t(`about.t${i}.title`)}</h3>
            <p>{t(`about.t${i}.body`)}</p>
          </article>
        ))}
      </div>

      <div className="about-usecases">
        <h3>{t('about.usecasesTitle')}</h3>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>{t(`about.uc${i}`)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
