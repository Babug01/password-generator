import { useMemo, useState } from "react";
import Header from "./components/Header";
import { buildCharset, calcEntropyBits, strengthLabel, generateBulk } from "./lib/password";

const REPO_URL = "https://github.com/Babug01/password-generator";

const STRENGTH_COLOR = {
  Weak: "#e05c5c",
  Fair: "#e0a05c",
  Strong: "#3fb950",
  "Very strong": "#4f46e5",
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const charset = useMemo(
    () => buildCharset({ upper, lower, digits, symbols, excludeAmbiguous }),
    [upper, lower, digits, symbols, excludeAmbiguous]
  );

  const bits = calcEntropyBits(length, charset.length);
  const label = strengthLabel(bits);

  function generate() {
    if (!charset) {
      setPasswords([]);
      return;
    }
    setPasswords(generateBulk(charset, length, count));
  }

  function copy(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1200);
  }

  return (
    <div style={styles.root}>
      <Header repoUrl={REPO_URL} />
      <div style={styles.content}>
        <h1 style={styles.title}>Password Generator</h1>
        <p style={styles.subtitle}>
          Generates passwords locally using the browser's cryptographic RNG. Strength is a real
          entropy calculation (length × log2(charset size)), not a canned regex pattern score.
        </p>

        <div style={styles.panel}>
          <div style={styles.field}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Length</span>
              <span style={styles.lengthVal}>{length}</span>
            </div>
            <input
              type="range" min={4} max={64} value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.checkGrid}>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase (A-Z)
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> Lowercase (a-z)
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} /> Digits (0-9)
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols (!@#$...)
            </label>
          </div>

          <label style={styles.checkLabel}>
            <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} />
            Exclude ambiguous characters (0, O, 1, l, I)
          </label>

          <div style={styles.field}>
            <span style={styles.label}>Generate</span>
            <div style={styles.row}>
              <input
                type="number" min={1} max={100} value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                style={{ ...styles.input, width: 90 }}
              />
              <span style={{ fontSize: 13, opacity: 0.7 }}>password(s)</span>
              <button style={styles.btn("primary")} onClick={generate}>Generate</button>
            </div>
          </div>

          {!charset && <div style={styles.errorBox}>Select at least one character set.</div>}

          {charset && (
            <div style={styles.entropyRow}>
              <span style={{ ...styles.strengthBadge, color: STRENGTH_COLOR[label], background: `${STRENGTH_COLOR[label]}20` }}>
                {label}
              </span>
              <span style={styles.entropyText}>{bits.toFixed(1)} bits of entropy · charset size {charset.length}</span>
            </div>
          )}
        </div>

        {passwords.length > 0 && (
          <div style={styles.resultList}>
            {passwords.map((p, i) => (
              <div key={i} style={styles.resultRow}>
                <span style={styles.resultText}>{p}</span>
                <button style={styles.iconBtn} onClick={() => copy(p, i)}>{copiedIdx === i ? "Copied" : "Copy"}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100dvh", display: "flex", flexDirection: "column" },
  content: {
    fontFamily: "system-ui, sans-serif", padding: "24px 32px", maxWidth: 700, margin: "0 auto",
    color: "var(--text, #1a1a1a)", width: "100%", boxSizing: "border-box", background: "var(--bg-subtle, #f0efed)", flex: 1,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 13, opacity: 0.6, margin: "4px 0 20px" },
  panel: {
    padding: 20, borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg, #fff)",
    display: "flex", flexDirection: "column", gap: 18, marginBottom: 20,
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12, fontWeight: 600, opacity: 0.65 },
  lengthVal: { fontSize: 13, fontWeight: 700, fontFamily: "'SFMono-Regular', Consolas, monospace" },
  slider: { width: "100%" },
  checkGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  checkLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  row: { display: "flex", alignItems: "center", gap: 10 },
  input: {
    padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border, #e5e7eb)",
    background: "var(--input-bg, #f9fafb)", color: "var(--text, #1a1a1a)", fontSize: 13,
  },
  btn: (kind) => ({
    padding: "9px 18px", borderRadius: 6, border: kind === "primary" ? "none" : "1px solid var(--border, #e5e7eb)",
    background: kind === "primary" ? "var(--accent, #4f46e5)" : "transparent",
    color: kind === "primary" ? "#fff" : "var(--text, #1a1a1a)", cursor: "pointer", fontSize: 13, fontWeight: 600,
  }),
  errorBox: {
    padding: "10px 14px", borderRadius: 8, border: "1px solid #e05c5c", background: "rgba(224,92,92,0.08)",
    color: "#e05c5c", fontSize: 13,
  },
  entropyRow: { display: "flex", alignItems: "center", gap: 10 },
  strengthBadge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  entropyText: { fontSize: 12, opacity: 0.6 },
  resultList: { display: "flex", flexDirection: "column", gap: 8 },
  resultRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px",
    borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg, #fff)",
  },
  resultText: { fontFamily: "'SFMono-Regular', Consolas, monospace", fontSize: 14, wordBreak: "break-all" },
  iconBtn: {
    padding: "2px 10px", borderRadius: 6, border: "1px solid var(--border, #e5e7eb)", background: "transparent",
    color: "var(--text, #1a1a1a)", cursor: "pointer", fontSize: 11, flexShrink: 0,
  },
};
