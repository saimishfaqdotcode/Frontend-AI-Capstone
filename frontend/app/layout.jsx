import "./globals.css";

export const metadata = {
  title: "Saim Ishfaq | Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="navbar">
            <a href="/" className="logo">
              Saim Ishfaq
            </a>

            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/projects">Projects</a>
              <a href="/contact">Contact</a>
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}