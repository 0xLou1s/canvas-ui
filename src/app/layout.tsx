import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { FlagNotice } from "@/components/common/flag-notice";
import { ThemeFavicon } from "@/components/common/theme-favicon";
import { ThemeProvider } from "@/components/common/theme-provider";

const SITE_URL = "https://canvasui.dev";
const DESCRIPTION =
  "An open source library of creative, framework-agnostic components drawn on canvas. Fluid simulations and shader effects that run over your live interface.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Canvas UI",
    template: "%s | Canvas UI",
  },
  description: DESCRIPTION,
  applicationName: "Canvas UI",
  authors: [{ name: "David Haz", url: "https://github.com/DavidHDev" }],
  creator: "David Haz",
  keywords: [
    "canvas",
    "webgl",
    "html-in-canvas",
    "creative ui",
    "shader effects",
    "react",
    "vue",
    "svelte",
    "shadcn registry",
  ],
  openGraph: {
    type: "website",
    siteName: "Canvas UI",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Canvas UI" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <ThemeFavicon />
          {children}
          <FlagNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
