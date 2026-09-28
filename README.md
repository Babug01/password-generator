# Password Generator

**Live demo:** https://password-generator-three-ecru-71.vercel.app (Vercel) · [GitHub Pages mirror](https://babug01.github.io/password-generator/)

Generates strong, random passwords entirely in the browser using the Web Crypto API — with a real
entropy calculation behind the strength label instead of the usual canned regex pattern score
("has a number, has a symbol, therefore strong"). Nothing generated here is ever sent anywhere.

## Features

- **Length slider** (4–64 characters) and **checkboxes** for uppercase, lowercase, digits, and
  symbols
- **Exclude ambiguous characters** toggle — drops `0`, `O`, `1`, `l`, `I` from the charset so
  generated passwords are easier to read back and type correctly
- **Bulk generation** — produce up to 100 passwords at once from the same settings
- **Real entropy math**: `length × log2(charset size)`, shown in bits — not a pattern-matching
  heuristic
- **Strength band** derived from that entropy figure: under 40 bits Weak, 40–60 Fair, 60–80 Strong,
  80+ Very strong
- **Cryptographically secure randomness** via `crypto.getRandomValues` with rejection sampling
  (avoids the modulo bias a naive `Math.random() % charsetLength` would introduce)
- One-click copy per generated password

## Tech stack

[React](https://react.dev/) + [Vite](https://vitejs.dev/) — generation and entropy math are plain
JavaScript using the browser's Web Crypto API, no external password/entropy library.

## Running locally

```bash
git clone https://github.com/Babug01/password-generator.git
cd password-generator
npm install
npm run dev
```

## License

MIT — see [LICENSE](LICENSE).
