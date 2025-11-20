"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
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

const initialMermaid = `sequenceDiagram
  participant User
  participant App as Markdown/Mermaid App
  participant Renderer as Mermaid Renderer

  User->>App: Mermaid テキストを入力
  App-->>Renderer: Mermaid の描画をリクエスト
  Renderer-->>App: SVG を返却
  App-->>User: Mermaid プレビューを表示`;

export default function HomePage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [mermaidText, setMermaidText] = useState(initialMermaid);
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const mermaidContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "dark" });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const renderMermaid = async () => {
      if (!mermaidContainerRef.current) return;

      try {
        setMermaidError(null);
        const { svg } = await mermaid.render(
          `mermaid-diagram-${Date.now()}`,
          mermaidText
        );

        if (!isMounted) return;

        mermaidContainerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Failed to render mermaid diagram", error);
        if (!isMounted) return;

        if (mermaidContainerRef.current) {
          mermaidContainerRef.current.innerHTML = "";
        }
        setMermaidError("Mermaid の描画に失敗しました");
      }
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [mermaidText]);

  return (
    <main className="page">
      <header className="page__header">
        <h1>Markdown & Mermaid Editor</h1>
        <p>Type Markdown and Mermaid on the left to see live previews on the right.</p>
      </header>
      <section className="editor">
        <div className="editor__stack">
          <label className="editor__pane">
            <div className="editor__pane-header">Markdown Input</div>
            <textarea
              className="editor__textarea"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              aria-label="Markdown input"
            />
          </label>
          <label className="editor__pane">
            <div className="editor__pane-header">Mermaid Input</div>
            <textarea
              className="editor__textarea"
              value={mermaidText}
              onChange={(event) => setMermaidText(event.target.value)}
              aria-label="Mermaid input"
            />
          </label>
        </div>

        <div className="editor__stack">
          <div className="editor__pane">
            <div className="editor__pane-header">Markdown プレビュー</div>
            <div className="editor__preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
          <div className="editor__pane">
            <div className="editor__pane-header">Mermaid プレビュー</div>
            <div className="editor__preview mermaid-preview" ref={mermaidContainerRef} />
            {mermaidError && <p className="mermaid-error">{mermaidError}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
