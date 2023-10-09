import "../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "%s | EdComposer",
  description:
    "The best way to create beautifully edited educational videos with AI",
  // Author
  author: {
    name: "Dhravya Shah",
    twitter: "dhravyashah",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
