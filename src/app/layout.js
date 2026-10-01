
import "./globals.css";

export const metadata = {
  title: "Tawana's Chess.com Clone",
  description: "a chess web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}