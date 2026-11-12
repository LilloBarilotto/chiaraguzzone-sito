#!/usr/bin/env bash
# Controlli automatici prima di ogni commit: `npm run verify`.
# Fallisce (exit 1) se una regola è violata. Le regole sono spiegate nei documenti interni del progetto.
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
err() { echo "✗ $1"; fail=1; }
ok() { echo "✓ $1"; }

npm run build --silent >/dev/null 2>&1 && ok "build" || { echo "✗ build fallita (npm run build per i dettagli)"; exit 1; }
npx astro check 2>&1 | grep -qE "^- 0 errors" && npx astro check 2>&1 | grep -qE "^- 0 warnings" && ok "astro check" || err "astro check con errori o warning"

# Pagine pubbliche (escluso il CMS)
pub=$(find dist -name '*.html' -not -path 'dist/admin/*')

# 1. Note interne e commenti HTML non devono arrivare nel sito pubblicato
grep -l -e "DA CONFERMARE" -e "<!--" $pub >/dev/null 2>&1 && err "note interne o <!-- --> nell'HTML pubblicato: $(grep -l -e 'DA CONFERMARE' -e '<!--' $pub | tr '\n' ' ')" || ok "nessuna nota interna nell'HTML"

# 2. Deontologia: "psicoterapeut*" e "sessuolog*" ammessi solo in Chi sono e nella FAQ dedicata (pagina FAQ)
bad=$(grep -liE "psicoterapeut|sessuolog" $pub | grep -vE "dist/chi-sono/|dist/faq/|dist/index.html")
[ -n "$bad" ] && err "'psicoterapeuta/sessuologia' fuori da Chi sono/FAQ: $bad" || ok "titoli professionali"
grep -qiE "<title>[^<]*psicoterapeut" $pub && err "'psicoterapeuta' in un <title>" || true
grep -lE "€ ?[0-9]|[0-9] ?€" $pub >/dev/null 2>&1 && err "prezzi nel sito: $(grep -lE '€ ?[0-9]|[0-9] ?€' $pub | tr '\n' ' ')" || ok "nessun prezzo"

# 3. Albo visibile in ogni pagina (footer)
missing=$(grep -L "26564" $pub)
[ -n "$missing" ] && err "numero Albo mancante in: $missing" || ok "numero Albo in tutte le pagine"

# 4. Nessun dominio scritto a mano nei sorgenti (usa SITE_URL)
grep -rn "chiaraguzzone\.it" src >/dev/null 2>&1 && err "dominio hardcoded in src/: $(grep -rln 'chiaraguzzone\.it' src | tr '\n' ' ')" || ok "nessun dominio hardcoded"

# 5. Niente risorse da CDN esterni nelle pagine pubbliche (font, script, css)
grep -hoE '(src|href)="https?://[^"]+\.(js|css|woff2?)"' $pub | grep -q . && err "risorse esterne caricate dalle pagine" || ok "nessuna risorsa esterna"

# 6. Segreti
git grep --untracked -nIE "(client_secret|BEGIN [A-Z ]*PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,})" -- . ':!package-lock.json' ':!scripts/verify.sh' && err "possibile segreto nel repo" || ok "nessun segreto"

# 7. SRI sullo script del CMS
grep -q 'integrity="sha384-' public/admin/index.html && ok "SRI sul CMS" || err "manca integrity sullo script Sveltia"

# 8. Dipendenze
npm audit --omit=dev --audit-level=high >/dev/null 2>&1 && ok "npm audit" || err "vulnerabilità high/critical (npm audit)"

# 9. Repo pubblico (ADR 0004): niente note interne né documenti interni nei file del repo, commit con email anonima
files=$(git ls-files --cached --others --exclude-standard)
echo "$files" | grep -v '^scripts/verify.sh$' | xargs grep -l "DA CONFERMARE" 2>/dev/null | grep -q . && err "note [DA CONFERMARE] nei file del repo: vanno in interno/da-confermare.md" || ok "nessuna nota interna nel repo"
echo "$files" | grep -qE '^(CLAUDE\.md|GLOSSARY\.md|CONTRACTS\.md|docs/|interno/)' && err "documenti interni nel repo pubblico: $(echo "$files" | grep -E '^(CLAUDE\.md|GLOSSARY\.md|CONTRACTS\.md|docs/|interno/)' | tr '\n' ' ')" || ok "nessun documento interno nel repo"
git config user.email | grep -q '@users\.noreply\.github\.com$' && ok "email anonima nei commit" || err "git user.email non è l'email anonima di GitHub (…@users.noreply.github.com)"

[ $fail -eq 0 ] && echo "Tutto OK" || { echo "Ci sono regole violate"; exit 1; }
