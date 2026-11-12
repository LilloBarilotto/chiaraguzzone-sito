import home from '../data/home.json';

/** Interruttore "Mostra questa sezione" della Home. Assente = acceso. */
export const mostra = (sezione: { show?: boolean } | undefined) => sezione?.show !== false;

export { home };
