import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import axios from "axios";
import { Providers } from "./Provider";
import ClientLayout from "./ClientLayout"; 

axios.defaults.withCredentials = true;

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700'],
});

export const metadata = {
  title: "BG ADMIN",
  description: "The clear insights your business needs to achieve true brilliance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  className={`${nunito.variable} antialiased `}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
