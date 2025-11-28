import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumos Prioritiser",
  description: "Cut through the marketing chaos and see what matters next.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="header">
            <div className="header-inner">
              <img
                src="/lumos-logo-white.svg"
                alt="Lumos Digital Marketing"
                className="logo"
              />
              <span className="tagline">
                Marketing team in a box, now in app form.
              </span>
            </div>
          </header>

          <main className="main-content">{children}</main>

          <footer className="footer">
            <div className="footer-inner">
              Built by Lumos Digital Marketing · Beta tool.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}