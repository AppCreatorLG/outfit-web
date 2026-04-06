import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>

      <body className="bg-gradient-to-b from-white to-indigo-50 min-h-screen">
        <Providers> {/* ✅ THIS IS THE FIX */}

          <div className="max-w-md mx-auto min-h-screen flex flex-col">

            <header className="p-4 border-b font-semibold text-lg text-center">
              ClosetLogic
            </header>

            <main className="flex-1 p-4 pb-20">
              {children}
            </main>

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t bg-white flex justify-around p-3">
              <button>Closet</button>
              <button>Outfits</button>
              <button>Profile</button>
            </nav>

          </div>

        </Providers> {/* ✅ WRAP ENDS HERE */}
      </body>
    </html>
  );
}