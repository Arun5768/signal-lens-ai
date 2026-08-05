# Signal Lens AI

Signal Lens AI is an explainable text intelligence dashboard built around a small, deterministic NLP pipeline. It classifies the tone of a message, extracts high-signal phrases, estimates urgency, and shows the evidence behind each result instead of returning an opaque label.

The project is intentionally built as an intermediate-level portfolio project: the interface is polished enough to demonstrate product thinking, while the model layer stays readable enough to study, test, and replace with a trained classifier later.

## Live demo

The app runs locally on a Zo Computer and can be published from the Zo Sites panel. The demo is designed for short messages such as customer feedback, support tickets, product notes, and internal updates.

## What it demonstrates

- Explainable sentiment and intent classification
- Confidence scoring with visible evidence
- Phrase and keyword extraction
- Urgency estimation from language signals
- Responsive React dashboard with dark/light themes
- Deterministic analysis that works without a paid API key
- Clear separation between the UI and the model adapter

## Technical approach

The current model adapter lives in `src/lib/analyzer.ts`. It uses weighted lexical signals, negation handling, phrase matching, and confidence calibration. This makes the demo deterministic and easy to run locally. The adapter boundary is deliberate: a future version can replace the heuristic scorer with a fine-tuned transformer, hosted inference endpoint, or an embedding-based retrieval layer without rewriting the dashboard.

The frontend is built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons. The app is hosted as a Zo Site with Bun and Hono handling the development and production process.

## Run locally

```bash
bun install
bun run dev
```

The Zo Computer manages the site process automatically. To create a production build:

```bash
bun run build
```

## Project structure

```text
src/
├── App.tsx                 # Router and theme provider
├── pages/blank-demo.tsx    # Signal Lens dashboard
├── lib/analyzer.ts         # Explainable text analysis model
├── styles.css              # Global styles and theme tokens
└── theme.json              # Light and dark design tokens
```

## Example workflow

1. Paste a support message or product note into the composer.
2. Run the analysis.
3. Review the tone, intent, urgency, and confidence.
4. Inspect the extracted signals to understand why the model reached its conclusion.
5. Use the reset action to compare several messages quickly.

## Roadmap

- Add a labeled evaluation set and model-quality report
- Add exportable JSON results for downstream workflows
- Compare the lexical baseline with a small trained classifier
- Add multilingual analysis with language detection
- Add feedback capture for correcting false positives

## License

MIT
