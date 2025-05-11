import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Social Media App",
  description: "A social media app for young users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
