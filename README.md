# Sito della Dott.ssa Chiara Guzzone

Sito statico con [Astro](https://astro.build), contenuti gestiti con [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (`/admin`), pubblicato su Netlify.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run verify   # build, controlli e npm audit: da lanciare prima di ogni commit
```

I testi sono in `src/content/` e `src/content-pages/`, i dati di contatto e i testi della Home in `src/data/`.
Le modifiche ai contenuti si fanno di norma dal pannello `/admin`.

Tutti i diritti riservati: vedi [LICENSE](LICENSE). Testi, immagini e codice non sono riutilizzabili senza permesso.
