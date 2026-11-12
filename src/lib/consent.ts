/** Consenso ai cookie di Google Maps (ADR 0003). Solo localStorage, nessun cookie nostro. */
export const CONSENT_KEY = 'cg-consent';
export const CONSENT_EVENT = 'cg-consent-change';
export const CONSENT_OPEN_EVENT = 'cg-consent-open';
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 183; // ~6 mesi

/** true = accettato, false = rifiutato, null = nessuna scelta valida (mai fatta o scaduta) */
export function getConsent(): boolean | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { maps?: unknown; ts?: unknown };
    if (typeof data.maps !== 'boolean' || typeof data.ts !== 'number') return null;
    if (Date.now() - data.ts > MAX_AGE_MS) return null;
    return data.maps;
  } catch {
    return null;
  }
}

export function setConsent(maps: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ maps, ts: Date.now() }));
  } catch {
    /* storage non disponibile: la scelta vale solo per questa pagina */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { maps } }));
}

export function openConsentBanner(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
