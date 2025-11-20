import type { Metadata } from 'next';
import { Playfair_Display, PT_Sans, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/src/context/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Icons } from '@/components/icons';
import { Analytics } from '@vercel/analytics/next';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: 'Passy - Baby Shower Planner',
  description: 'The simplest way to plan a beautiful baby shower',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${ptSans.variable} ${dancingScript.variable} font-sans antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <Sidebar>
                <SidebarHeader className="border-b">
                  <div className="flex items-center gap-2 px-2 py-3">
                    <Icons.Logo className="h-6 w-6 text-primary" />
                    <h1 className="font-headline text-xl font-bold text-primary">Passy</h1>
                  </div>
                </SidebarHeader>
                <SidebarContent className="p-4">
                  <SidebarNav />
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                  <p className="text-xs text-muted-foreground text-center">
                    © 2025 Passy
                  </p>
                </SidebarFooter>
              </Sidebar>
              <main className="flex-1 overflow-auto">
                {children}
                <Analytics />
              </main>
            </div>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


