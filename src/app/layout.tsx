import "./globals.css";

import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

import { AuthContextProvider } from '../context/AuthProvider'

import { Header } from '../components/header/index'

import { Footer } from '../components/footer/index'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Treinos',
  description: 'Gerencie sua rotina na academia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Header />
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        <Footer />
      </body>
    </html>
  );
}


