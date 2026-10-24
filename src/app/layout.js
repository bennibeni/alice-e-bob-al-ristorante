import './globals.css';

export const metadata = {
  title: 'Alice e Bob al ristorante',
  description: 'Il teorema di Bell raccontato una cena alla volta: un racconto illustrato con simulazioni interattive, Alice, Bob e due ristoranti gemelli.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        {children}
        <footer className="projects-footer">
          <a href="https://links-page-bennibeni.vercel.app/">← All projects</a>
        </footer>
      </body>
    </html>
  );
}
