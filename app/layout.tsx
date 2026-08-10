import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AI Exam Trainer — Luyện thi Kỹ sư AI',
  description: 'Website luyện thi trắc nghiệm để ôn thi đầu vào ngành Kỹ sư AI. Bao gồm Toán học, Lập trình, Machine Learning, và Đạo đức AI.',
  keywords: ['AI', 'Machine Learning', 'luyện thi', 'trắc nghiệm', 'kỹ sư AI'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0f1117] text-gray-200 min-h-screen">
        <Sidebar />
        {/* Main content area offset for sidebar/header */}
        <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
