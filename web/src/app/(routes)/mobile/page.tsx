// import type React from "react";
// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
// import { FloatingDock } from "@/components/floating-dock";
// import { Home, Search, Bell, MessageSquare } from "lucide-react";
// import { Suspense } from "react";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "CyberSocial - Cyberpunk Social Media",
//   description: "A cyberpunk-themed social media application",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <Suspense>
//             {children}
//             <FloatingDock
//               items={navItems}
//               desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
//               mobileClassName="fixed bottom-6 right-6 z-50"
//             />
//           </Suspense>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
