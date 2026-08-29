import type { Metadata } from "next";
import { Anton, Fraunces, Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

const fraunces = Fraunces({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DADÁ STUDIO",
  description: "Gestión de alumnos, horarios y pagos de DADÁ STUDIO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${anton.variable} ${fraunces.variable} ${workSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-ink-50 font-sans text-ink-900">
        <Script id="tema-inicial" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('tema');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
