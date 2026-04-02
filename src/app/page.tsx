"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("neon-todos");
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("neon-todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const total = todos.length;

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <h1
            className="text-5xl font-mono tracking-widest mb-2"
            style={{
              color: "#00f5ff",
              textShadow:
                "0 0 10px #00f5ff, 0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,0.5)",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            NEON TODO
          </h1>
          <p className="text-sm tracking-widest" style={{ color: "#555" }}>
            タスク管理システム
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-8">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-600"
            style={{
              border: "1px solid #00f5ff",
              boxShadow: "0 0 6px rgba(0,245,255,0.4), inset 0 0 10px rgba(0,245,255,0.05)",
              color: "#e0e0e0",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 12px rgba(0,245,255,0.8), inset 0 0 15px rgba(0,245,255,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 6px rgba(0,245,255,0.4), inset 0 0 10px rgba(0,245,255,0.05)";
            }}
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="px-5 py-3 text-sm font-mono tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              border: "1px solid #39ff14",
              color: "#39ff14",
              boxShadow: "0 0 8px rgba(57,255,20,0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              if (!input.trim()) return;
              e.currentTarget.style.background = "rgba(57,255,20,0.1)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(57,255,20,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "0 0 8px rgba(57,255,20,0.5)";
            }}
          >
            追加
          </button>
        </div>

        {/* カウンター */}
        {total > 0 && (
          <div className="flex justify-between mb-4 text-xs font-mono tracking-widest px-1">
            <span style={{ color: "#555" }}>
              TOTAL:{" "}
              <span style={{ color: "#00f5ff" }}>{total}</span>
            </span>
            <span style={{ color: "#555" }}>
              REMAINING:{" "}
              <span style={{ color: remaining === 0 ? "#39ff14" : "#ff00ff" }}>
                {remaining}
              </span>
            </span>
          </div>
        )}

        {/* Todoリスト */}
        <div className="space-y-2">
          {!mounted ? null : todos.length === 0 ? (
            <div
              className="text-center py-16 text-sm tracking-widest"
              style={{ color: "#333", fontFamily: "'Share Tech Mono', monospace" }}
            >
              NO TASKS FOUND
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 px-4 py-3 transition-all duration-300 group"
                style={{
                  border: todo.completed
                    ? "1px solid #1a1a1a"
                    : "1px solid #1e1e1e",
                  background: todo.completed
                    ? "rgba(0,0,0,0.3)"
                    : "rgba(0,245,255,0.02)",
                  boxShadow: todo.completed
                    ? "none"
                    : "inset 0 0 20px rgba(0,245,255,0.03)",
                }}
                onMouseEnter={(e) => {
                  if (!todo.completed) {
                    e.currentTarget.style.borderColor = "#00f5ff";
                    e.currentTarget.style.boxShadow =
                      "0 0 8px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = todo.completed
                    ? "#1a1a1a"
                    : "#1e1e1e";
                  e.currentTarget.style.boxShadow = todo.completed
                    ? "none"
                    : "inset 0 0 20px rgba(0,245,255,0.03)";
                }}
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-200"
                  style={{
                    border: todo.completed
                      ? "1px solid #39ff14"
                      : "1px solid #333",
                    boxShadow: todo.completed
                      ? "0 0 8px rgba(57,255,20,0.6)"
                      : "none",
                    background: "transparent",
                  }}
                  aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                >
                  {todo.completed && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#39ff14"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* テキスト */}
                <span
                  className="flex-1 text-sm leading-relaxed"
                  style={{
                    color: todo.completed ? "#333" : "#d0d0d0",
                    textDecoration: todo.completed ? "line-through" : "none",
                    textDecorationColor: "#444",
                  }}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ color: "#ff00ff", background: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textShadow =
                      "0 0 8px #ff00ff, 0 0 16px #ff00ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textShadow = "none";
                  }}
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* 完了タスクをクリア */}
        {todos.some((t) => t.completed) && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
              className="text-xs tracking-widest transition-all duration-200 px-4 py-2"
              style={{
                color: "#333",
                border: "1px solid #1a1a1a",
                background: "transparent",
                fontFamily: "'Share Tech Mono', monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff00ff";
                e.currentTarget.style.borderColor = "#ff00ff";
                e.currentTarget.style.boxShadow = "0 0 8px rgba(255,0,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#333";
                e.currentTarget.style.borderColor = "#1a1a1a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              完了タスクを削除
            </button>
          </div>
        )}

        {/* フッター */}
        <div
          className="mt-16 text-center text-xs tracking-widest"
          style={{
            color: "#1a1a1a",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          SYSTEM ONLINE
        </div>
      </div>
    </main>
  );
}
