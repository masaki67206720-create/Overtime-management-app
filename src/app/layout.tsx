import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "超勤管理システム",
  description: "超過勤務時間の登録・管理・確認アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
