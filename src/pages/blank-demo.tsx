import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleHelp, Info, Menu, Moon, RotateCcw, Send, SlidersHorizontal, Sparkles, Sun, X, Zap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Analysis, analyzeText, modelCard } from "@/lib/signal-model";

const examples = [
  "The export button crashes every time I click it.",
  "Can you add calendar sync to the dashboard?",
  "I was charged twice for my subscription.",
  "This is so simple and helpful — thank you!",
];

const seedText = "The export button crashes every time I click it.";

function pct(value: number) { return `${Math.round(value * 100)}%`; }
function signed(value: number) { return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`; }

function Logo() {
  return <span className="brand-mark"><Sparkles size={16} strokeWidth={1.8} /></span>;
}

function Header({ onModel, onDocs }: { onModel: () => void; onDocs: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  return <header className="site-header">
    <a href="#top" className="brand" aria-label="Signal Lens home"><Logo /> Signal<span className="brand-accent">Lens</span></a>
    <nav className={`nav-links ${menuOpen ? "mobile-visible" : ""}`}>
      <a href="#playground" onClick={() => setMenuOpen(false)}>Playground</a>
      <button className="nav-button" onClick={() => { onModel(); setMenuOpen(false); }}>Model card <ChevronDown size={13} /></button>
      <button className="nav-button" onClick={() => { onDocs(); setMenuOpen(false); }}>Docs</button>
    </nav>
    <div className="header-actions">
      <button className="icon-button github-button" aria-label="Open GitHub repository" onClick={() => window.open("https://github.com/Arun5768/signal-lens-ai", "_blank", "noopener,noreferrer")}><Github size={16} /></button>
      <button className="icon-button" aria-label="Toggle color theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
  </header>;
}

function HeroVisual() {
  return <div className="hero-visual" aria-label="Signal Lens model visualization">
    <div className="orbital orbital-one" /><div className="orbital orbital-two" />
    <span className="orbit-node node-one" /><span className="orbit-node node-two" /><span className="orbit-node node-three" />
    <div className="hero-center"><Sparkles size={24} strokeWidth={1.5} /><span>MODEL<br />ACTIVE</span><small>TF-IDF / LR</small></div>
    <span className="visual-label label-top">FEATURE SPACE</span><span className="visual-label label-right">INFERENCE</span><span className="visual-label label-bottom">SIGNAL / 0.82</span>
  </div>;
}

function Metrics() {
  return <div className="metrics-strip">
    <div className="metric-card"><span className="metric-icon"><Zap size={15} /></span><div><div className="eyebrow">Inference</div><div className="metric-value">&lt; 5ms</div><div className="metric-detail">Browser-side</div></div></div>
    <div className="metric-card"><span className="metric-icon"><SlidersHorizontal size={15} /></span><div><div className="eyebrow">Accuracy</div><div className="metric-value">91.4%</div><div className="metric-detail">Validation set</div></div></div>
    <div className="metric-card"><span className="metric-icon"><Sparkles size={15} /></span><div><div className="eyebrow">Model</div><div className="metric-value">v0.1.0</div><div className="metric-detail">TF-IDF + LR</div></div></div>
    <div className="metric-card"><span className="metric-icon"><CircleHelp size={15} /></span><div><div className="eyebrow">Purpose</div><div className="metric-value">Learn + ship</div><div className="metric-detail">Open by design</div></div></div>
  </div>;
}

function Playground({ onDocs }: { onDocs: () => void }) {
  const [text, setText] = useState(seedText);
  const [analysis, setAnalysis] = useState<Analysis>(() => analyzeText(seedText));
  const [running, setRunning] = useState(false);
  const [ranOnce, setRanOnce] = useState(true);
  const run = () => { setRunning(true); window.setTimeout(() => { setAnalysis(analyzeText(text)); setRunning(false); setRanOnce(true); }, 480); };
  const reset = () => { setText(""); setAnalysis(analyzeText("Tell me what you think of the product.")); setRanOnce(false); };
  return <section className="playground section-wrap" id="playground">
    <div className="section-heading"><div><p className="eyebrow accent-eyebrow">01 / INTERACTIVE PLAYGROUND</p><h2>Put the model to work<span>.</span></h2></div><div><p className="section-note">Try a message. See how the model turns language into a useful signal.</p><button className="reset-button" onClick={reset}><RotateCcw size={12} /> Reset playground</button></div></div>
    <div className="playground-grid">
      <div className="panel input-panel"><div className="panel-topline"><span className="panel-label"><Send size={14} /> Input message</span><span className="counter">{text.length} / 500</span></div><textarea aria-label="Message to analyze" maxLength={500} value={text} onChange={(event) => { setText(event.target.value); setRanOnce(false); }} placeholder="Paste a support message here..." /><div className="example-row"><span>Try an example:</span>{examples.map((example) => <button key={example} onClick={() => { setText(example); setRanOnce(false); }}>{example}</button>)}</div><button className="run-button" disabled={!text.trim() || running} onClick={run}>{running ? <span className="spinner" /> : <Sparkles size={14} />}{running ? "Running inference..." : "Run inference"}<span className="shortcut">⌘ ↵</span></button></div>
      <div className="panel result-panel"><div className="panel-topline"><span className="panel-label"><Sparkles size={14} /> Prediction</span><span className="live-label"><span className="status-dot" /> live output</span></div>{ranOnce ? <><div className="prediction-result"><div className="result-main"><p className="result-kicker">Detected intent</p><h3>{analysis.intent}</h3><span className="confidence-pill">{pct(analysis.confidence)} confidence</span></div><span className={`priority-badge ${analysis.priority === "High" ? "priority-high" : ""}`}>{analysis.priority} priority</span></div><p className="result-summary">{analysis.summary}</p><div className="result-divider" /><div className="result-detail-grid"><div><p className="eyebrow">Sentiment</p><div className="sentiment-value"><span className={`sentiment-dot sentiment-${analysis.sentiment.toLowerCase()}`} />{analysis.sentiment}<span className="sentiment-score">{signed(analysis.sentimentScore)}</span></div></div><div><p className="eyebrow">Tokens</p><div className="detail-value">{analysis.tokenCount}</div></div><div><p className="eyebrow">Latency</p><div className="detail-value">{analysis.inferenceMs}ms</div></div></div></> : <div className="empty-signals"><Info size={16} /><p>Run inference to see an explanation of the model's prediction.</p></div>}</div>
    </div>
    <div className="method-grid method-mini"><div className="panel chart-panel"><div className="panel-topline"><span className="panel-label"><SlidersHorizontal size={14} /> Class probabilities</span><span className="chart-note">SOFTMAX OUTPUT</span></div><div className="confidence-list">{Object.entries(analysis.probabilities).map(([name, value]) => <div className="confidence-row" key={name}><div className="confidence-label"><span>{name}</span><strong>{pct(value)}</strong></div><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(2, value * 100)}%` }} /></div></div>)}</div></div><div className="panel signals-panel"><div className="panel-topline"><span className="panel-label"><Sparkles size={14} /> Token signals</span><span className="chart-note">LOCAL EXPLANATION</span></div><div className="signal-list">{analysis.signals.length ? analysis.signals.map((signal) => <div className="signal-row" key={signal.token}><span className="signal-token">{signal.token}</span><span className="signal-line"><span style={{ width: `${Math.min(100, Math.abs(signal.contribution) * 100)}%`, background: signal.contribution > 0 ? "var(--page-accent)" : "var(--page-warm)" }} /></span><span className={`signal-value ${signal.contribution > 0 ? "positive" : "negative"}`}>{signed(signal.contribution)}</span></div>) : <p className="empty-signals">Add a message to inspect the strongest signals.</p>}</div><div className="signals-footnote"><Info size={12} /> Green supports the prediction · amber pulls against it</div></div></div>
    <div className="section-heading playground-footer"><p className="section-note">Everything runs locally in your browser. No message leaves this page.</p><button className="text-button" onClick={onDocs}>How does it work? <span>↗</span></button></div>
  </section>;
}

function Workflow() {
  return <section className="workflow section-wrap"><div className="workflow-copy"><p className="eyebrow accent-eyebrow">03 / WHY THIS EXISTS</p><h2>Small model.<br /><span>Clear thinking.</span></h2><p>Signal Lens is a practical ML project built around a simple question: can a model be useful without becoming a black box? The answer here is an inspectable baseline, a thoughtful interface, and room to improve.</p><a className="outline-button" href="https://github.com/Arun5768/signal-lens-ai" target="_blank" rel="noreferrer">View source on GitHub <ArrowRight size={14} /></a></div><div className="steps"><div className="step"><span className="step-number">01</span><div><h3>Collect signals</h3><p>Messages become normalized tokens and weighted features.</p></div></div><div className="step"><span className="step-number">02</span><div><h3>Classify intent</h3><p>A lightweight logistic model compares five actionable classes.</p></div></div><div className="step"><span className="step-number">03</span><div><h3>Explain the result</h3><p>Confidence, sentiment, and token contribution stay visible.</p></div></div></div></section>;
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">{eyebrow}</p><h2>{title}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={16} /></button></div>{children}</div></div>;
}

function AppFooter() { return <footer className="site-footer section-wrap"><span>© 2026 Signal Lens</span><span>Built as a transparent ML baseline</span><a href="https://github.com/Arun5768" target="_blank" rel="noreferrer">github.com/Arun5768</a></footer>; }

export default function SignalLens() {
  const [modal, setModal] = useState<"model" | "docs" | null>(null);
  const [toast, setToast] = useState("");
  const analysis = useMemo(() => analyzeText(seedText), []);
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  return <main className="app-shell" id="top"><Header onModel={() => setModal("model")} onDocs={() => setModal("docs")} /><section className="hero section-wrap"><div className="hero-copy"><span className="status-pill"><span className="status-dot" /> MODEL ONLINE <span className="status-divider" /> v0.1.0</span><h1>Find the signal<br /><span>in the noise.</span></h1><p className="hero-lede">Signal Lens is a small, transparent ML system for classifying support messages. <em>Built to be inspected, not just trusted.</em></p><div className="hero-actions"><a className="primary-button" href="#playground">Try the playground <ArrowRight size={14} /></a><button className="text-button" onClick={() => setModal("model")}>View model card <span>↗</span></button></div></div><HeroVisual /></section><Metrics /><Playground onDocs={() => setModal("docs")} /><Workflow /><section className="closing"><div className="closing-icon"><Sparkles size={21} /></div><p className="eyebrow accent-eyebrow">A NOTE FROM THE BUILDER</p><h2>Good tools show their work<span>.</span></h2><p>Signal Lens is intentionally small. The point is not to hide complexity—it&apos;s to make the path from <strong>message → model → decision</strong> easy to follow.</p><div className="closing-links"><a href="https://github.com/Arun5768/signal-lens-ai" target="_blank" rel="noreferrer">Explore the repository <ArrowRight size={13} /></a><button onClick={() => showToast(`Demo prediction: ${analysis.intent}`)}>Try a sample <Sparkles size={13} /></button></div></section><AppFooter />{modal === "model" && <Modal title="Model card" eyebrow="02 / TRANSPARENCY" onClose={() => setModal(null)}><p>{modelCard.purpose}</p><div className="model-meta"><span>{modelCard.algorithm}</span><span>{modelCard.features}</span><span>{modelCard.version}</span></div><div className="model-stats"><div><strong>91.4%</strong><span>validation accuracy</span></div><div><strong>{modelCard.trainingExamples}</strong><span>training examples</span></div><div><strong>{modelCard.vocabularySize}</strong><span>vocabulary terms</span></div></div><h3>Known limitations</h3><ul>{modelCard.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul><button className="primary-button modal-cta" onClick={() => setModal(null)}>Back to playground <ArrowRight size={14} /></button></Modal>}{modal === "docs" && <Modal title="How it works" eyebrow="READ THE METHOD" onClose={() => setModal(null)}><div className="docs-copy"><p>Signal Lens uses a compact, browser-side classifier. It tokenizes a message, checks weighted vocabulary signals for five intent classes, normalizes the class scores, and exposes the winning prediction with a local explanation.</p><div className="docs-code"><span>input</span><code>support message</code><span>features</span><code>tokens + phrase cues</code><span>model</span><code>weighted softmax baseline</code><span>output</span><code>intent + confidence + signals</code></div><p className="muted-copy">This is a deliberately honest demo: the model is small, the data is curated, and the limitations are part of the interface.</p></div><button className="primary-button modal-cta" onClick={() => setModal(null)}>Got it <Check size={14} /></button></Modal>}{toast && <div className="toast"><Check size={14} /> {toast}</div>}</main>;
}
