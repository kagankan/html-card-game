import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "HTML 大富豪（ベータ）",
  description: "HTML card game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-53VW712TWK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-53VW712TWK');
          `}
        </Script>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <div className="app">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
