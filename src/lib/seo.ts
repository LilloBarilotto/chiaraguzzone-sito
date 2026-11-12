import { getImage } from 'astro:assets';
import ritratto from '../assets/chiara-guzzone-ritratto.jpg';
import { site, primaryStudio, whatsappUrl } from '../data/site';
import type { Studio } from '../data/site';

/** URL canonico, da astro.config (env URL di Netlify): niente slash finale. */
export const SITE_URL = import.meta.env.SITE.replace(/\/$/, '');
export const SUFFIX = 'Psicologa Milano – Chiara Guzzone';
export const pageTitle = (name: string) => `${name} | ${SUFFIX}`;

/** Immagine OG 960x504 (rapporto 1.91:1, Astro non ingrandisce oltre i 960px del ritratto) ricavata dal ritratto (ritaglio dall alto), generata al build. */
export const OG_DEFAULT = (
  await getImage({ src: ritratto, width: 960, height: 504, fit: 'cover', position: 'top', format: 'jpg' })
).src;

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

export const addressOf = (s: Studio) => ({
  '@type': 'PostalAddress',
  streetAddress: s.street,
  postalCode: s.postalCode,
  addressLocality: s.city,
  addressCountry: 'IT',
});

export const fullAddress = (s: Studio) => `${s.street}, ${s.postalCode} ${s.city}`;

export const personLd = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#chiara`,
  name: site.title,
  jobTitle: 'Psicologa',
  url: SITE_URL,
  telephone: site.phone,
  email: site.email,
  identifier: `Albo Psicologi Lombardia Sez. A n. ${site.alboNumber}`,
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Iscrizione all\'Albo degli Psicologi della Lombardia, Sez. A',
    identifier: site.alboNumber,
  },
};

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const faqLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});

/** Markdown grezzo -> testo semplice per FAQPage */
/** Markdown -> testo semplice per JSON-LD. Toglie prima le note interne ([//]: # "..." e <!-- -->). */
export const plain = (md: string = '') =>
  md
    .replace(/^\[\/\/\]: #.*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[*_`>#]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();

export const professionalServiceLd = (topics: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#studio`,
  name: site.title,
  description:
    'Psicologa e consulente sessuale a Milano (zona Pasteur) e online: sostegno psicologico individuale e di coppia, sessualità e affettività.',
  url: SITE_URL,
  telephone: site.phone,
  email: site.email,
  image: `${SITE_URL}${OG_DEFAULT}`,
  address: addressOf(primaryStudio),
  location: site.studios.map((s) => ({
    '@type': 'Place',
    name: s.name,
    address: addressOf(s),
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
  })),
  areaServed: [
    { '@type': 'City', name: 'Milano' },
    { '@type': 'Country', name: 'Italia', description: 'Colloqui online' },
  ],
  founder: personLd,
  employee: personLd,
  identifier: site.alboNumber,
  knowsAbout: topics,
});

export { whatsappUrl };
