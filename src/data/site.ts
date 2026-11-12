import data from './site.json';

export interface Studio {
  id: string;
  name: string;
  primary: boolean;
  street: string;
  city: string;
  postalCode: string;
  note: string;
  lat: number;
  lng: number;
  /** "Mostra questo studio". Assente = acceso. Lo studio principale si vede sempre. */
  show?: boolean;
}

export interface Site {
  name: string;
  title: string;
  role: string;
  albo: string;
  alboNumber: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappText: string;
  /** "Mostra WhatsApp". Assente = acceso. */
  showWhatsapp?: boolean;
  email: string;
  instagram: { handle: string; url: string };
  piva: string;
  studios: Studio[];
  online: boolean;
}

const raw: Site = data;

/**
 * Dati del sito con gli interruttori già applicati: `site.studios` contiene solo gli studi visibili
 * (il principale sempre, gli altri se "Mostra" è acceso). Footer, mappa, JSON-LD e modulo usano questo.
 */
export const site: Site = {
  ...raw,
  studios: raw.studios.filter((s) => s.primary || s.show !== false),
};

/** WhatsApp visibile: interruttore acceso e numero presente. Vale per tutti i bottoni e i link. */
export const hasWhatsapp = raw.showWhatsapp !== false && Boolean(raw.whatsapp);

export const whatsappUrl = (text: string = site.whatsappText) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const primaryStudio = site.studios.find((s) => s.primary) ?? site.studios[0];
