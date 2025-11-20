"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownItem = {
  id: string;
  title: string;
  markdown: string;
  mermaid: string;
  createdAt: string;
};

const STORAGE_KEY = "markdown_samples";

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
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<MarkdownItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const mermaidContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "dark" });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        const parsed: MarkdownItem[] = JSON.parse(storedItems);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to parse stored markdown items", error);
      }
    }
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

  const saveItemsToStorage = (nextItems: MarkdownItem[]) => {
    setItems(nextItems);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    }
  };

  const handleSave = () => {
    const now = new Date().toLocaleString();
    const itemTitle = title.trim() || "無題";
    const newItem: MarkdownItem = {
      id: crypto.randomUUID(),
      title: itemTitle,
      markdown,
      mermaid: mermaidText,
      createdAt: now,
    };

    const nextItems = [newItem, ...items];
    saveItemsToStorage(nextItems);
    setStatusMessage("保存しました");
    setTimeout(() => setStatusMessage(""), 2000);
  };

  const handleDelete = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    saveItemsToStorage(filtered);
  };

  const handleLoad = (item: MarkdownItem) => {
    setTitle(item.title);
    setMarkdown(item.markdown);
    setMermaidText(item.mermaid);
  };

  return (
    <main className="page">
      <header className="page__header">
        <h1>Markdown & Mermaid Editor</h1>
        <p>Type Markdown and Mermaid on the left to see live previews on the right.</p>
      </header>
      <section className="save-panel">
        <label className="save-panel__field">
          <span className="save-panel__label">タイトル</span>
          <input
            type="text"
            className="save-panel__input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="無題"
            aria-label="タイトル"
          />
        </label>
        <button className="save-panel__button" type="button" onClick={handleSave}>
          保存
        </button>
        {statusMessage && <span className="save-panel__status">{statusMessage}</span>}
      </section>
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
      <section className="saved-list">
        <h2>保存済みの Markdown</h2>
        {items.length === 0 ? (
          <p className="saved-list__empty">保存された Markdown はありません。</p>
        ) : (
          <ul className="saved-list__items">
            {items.map((item) => (
              <li key={item.id} className="saved-list__item">
                <button
                  className="saved-list__item-body"
                  type="button"
                  onClick={() => handleLoad(item)}
                  aria-label={`${item.title} を読み込む`}
                >
                  <div className="saved-list__title">{item.title}</div>
                  <div className="saved-list__date">{item.createdAt}</div>
                </button>
                <button
                  className="saved-list__delete"
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`${item.title} を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
