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
  email: string;
  instagram: { handle: string; url: string };
  piva: string;
  studios: Studio[];
  online: boolean;
}

export const site: Site = data;

export const whatsappUrl = (text: string = site.whatsappText) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const primaryStudio = site.studios.find((s) => s.primary) ?? site.studios[0];
