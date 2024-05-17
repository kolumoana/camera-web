import type { Metadata } from "next";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Camera Web Check",
  description: "Camera Web Check",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
