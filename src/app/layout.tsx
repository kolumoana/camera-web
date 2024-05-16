import type { Metadata } from "next";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Camera Example",
  description: "Camera Example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
