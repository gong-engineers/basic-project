import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import AuthProvider from '@/stores/AuthProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

const geistSans = Geist({
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SportHub',
  description:
    'SportHub — 다양한 스포츠용품과 굿즈를 한 곳에서 편하게 쇼핑할 수 있는 스포츠 전문 스토어입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <div className="flex flex-col min-h-screen">
          <AuthProvider>
            <Header />
            <div className="flex flex-col flex-1">{children}</div>
            <Footer />
          </AuthProvider>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
