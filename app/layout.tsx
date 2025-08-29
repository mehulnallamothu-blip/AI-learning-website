import "./globals.css";

export const metadata = {
  title: "AI Learning",
  description: "Starter AI learning website with chat, text gen, image classify",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
