// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Next App',
  description: 'Mon application Next.js avec pages dynamiques',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
