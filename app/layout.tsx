import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";

export const metadata = {
  title: "Notes App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="app">
          {children}
          <Toaster position="bottom-left" expand={true} richColors />
        </div>
      </body>
    </html>
  );
}
