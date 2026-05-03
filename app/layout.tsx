import type { Metadata } from "next";
import "./globals.css";
<body className="antialiased" suppressHydrationWarning></body>

export const metadata: Metadata = {
  title: "Resume Roaster — Brutally Honest Career Advice",
  description:
    "Upload your resume and get a savage, constructive critique powered by AI. Find out what's holding you back.",
  openGraph: {
    title: "Resume Roaster 🔥",
    description: "Get your resume brutally reviewed by AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
