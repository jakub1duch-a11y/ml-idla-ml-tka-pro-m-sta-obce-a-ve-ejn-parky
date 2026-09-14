export const EMAIL_TOPIC_OPTIONS = [
  {
    value: 'offers',
    label: 'Akční nabídky',
    description: 'Časově omezené nabídky a výhodné podmínky.',
  },
  {
    value: 'news_products',
    label: 'Novinky a nové produkty',
    description: 'Nové modely, funkce a aktuality MLŽIDLA®.',
  },
  {
    value: 'studies',
    label: 'Studie a doporučení',
    description: 'Odborné poznatky, inspirace a praktické návody.',
  },
  {
    value: 'personalized_settings',
    label: 'Doporučení pro moje nastavení',
    description: 'Tipy podle typu projektu a používaného mlžicího řešení.',
  },
];

export const EMAIL_CONSENT_VERSION = '2026-09-email-preferences-v1';

export const sanitizeEmailTopics = (topics) => {
  const allowed = new Set(EMAIL_TOPIC_OPTIONS.map((option) => option.value));
  return [...new Set((Array.isArray(topics) ? topics : []).filter((topic) => allowed.has(topic)))];
};
