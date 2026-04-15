import { useState } from 'react';
import { useT } from '../i18n/translations';

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const t = useT();

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <header className="faq-header">
        <h2 id="faq-heading">{t('faq.title')}</h2>
        <p>{t('faq.lead')}</p>
      </header>
      <div className="faq-list">
        {KEYS.map((k, i) => {
          const open = openIdx === i;
          return (
            <article
              key={k}
              className={`faq-item${open ? ' open' : ''}`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                className="faq-question"
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? null : i)}
              >
                <span itemProp="name">{t(`faq.q${k}`)}</span>
                <span className="faq-chevron" aria-hidden>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && (
                <div
                  className="faq-answer"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{t(`faq.a${k}`)}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
