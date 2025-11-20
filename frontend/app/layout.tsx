import type { Metadata } from 'next';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { Toaster } from '@/components/ui/sonner';
import { SidebarNav } from '@/components/sidebar-nav';
import { HeaderNav } from '@/components/header-nav';
import { AuthProvider } from '@/app/context/auth-context';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Passy Party Planner',
  description: 'Plan the perfect baby shower with Passy!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider defaultOpen>
              <Sidebar>
                <SidebarHeader>
                  <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors">
                    <Icons.Logo className="w-8 h-8 text-primary" />
                    <h2 className="text-lg font-headline font-semibold text-sidebar-foreground">Passy</h2>
                  </Link>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNav />
                </SidebarContent>
                <SidebarFooter>
                  {/* Placeholder for footer content like settings or user profile */}
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
                  <div className="md:hidden">
                     <SidebarTrigger />
                  </div>
                  <HeaderNav />
                  <div className="flex-1">
                    {/* Can add breadcrumbs or page title here if needed */}
                  </div>
                  {/* Placeholder for user actions / profile */}
                </header>
                <main className="flex-1 p-6 overflow-auto">
                  {children}
                  <Analytics />
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
