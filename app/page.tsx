"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const initialMarkdown = `# Markdown プレビュー

左側のエリアに Markdown を入力すると、このプレビューがリアルタイムに更新されます。

## サンプル
- **太字** や *斜体* のスタイル
- [リンク](https://nextjs.org)
- コードブロック:

\`\`\`ts
const greeting = "Hello Markdown";
console.log(greeting);
\`\`\`
`;

export default function HomePage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <main className="page">
      <header className="page__header">
        <h1>Markdown Editor</h1>
        <p>Type Markdown on the left to see a live preview on the right.</p>
      </header>
      <section className="editor">
        <label className="editor__pane">
          <div className="editor__pane-header">Markdown Input</div>
          <textarea
            className="editor__textarea"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            aria-label="Markdown input"
          />
        </label>
        <div className="editor__pane">
          <div className="editor__pane-header">Preview</div>
          <div className="editor__preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  );
}
