import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-open-sans"
});

export const metadata: Metadata = {
  title: "Corrida das Expressões",
  description: "Jogo educativo multiplayer de matemática para sala de aula."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={openSans.variable}>
      <body>{children}</body>
    </html>
  );
}
