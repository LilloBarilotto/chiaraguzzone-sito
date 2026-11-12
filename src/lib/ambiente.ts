// In quale versione del sito siamo.
// Netlify imposta CONTEXT durante la build: "production" per il sito vero (branch `produzione`),
// "branch-deploy" per l'Anteprima (branch `main`), "deploy-preview" per le pull request.
// In locale CONTEXT non c'è: il sito si comporta come quello vero.
const context = process.env.CONTEXT;

/** true nell'Anteprima: fascia in alto, modulo contatti spento, sempre noindex. */
export const IS_ANTEPRIMA = context === 'branch-deploy' || context === 'deploy-preview';

/** Il sito si può indicizzare solo se PUBLIC_INDEXABLE è "true" e non siamo nell'Anteprima. */
export const INDEXABLE = import.meta.env.PUBLIC_INDEXABLE === 'true' && !IS_ANTEPRIMA;

/** Pagina del pulsante "Pubblica il sito" (GitHub Actions). */
export const PUBBLICA_URL = 'https://github.com/LilloBarilotto/chiaraguzzone-sito/actions/workflows/pubblica.yml';
