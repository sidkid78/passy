'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/src/context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/account');
  };

  const features = [
    { title: 'Guest Manager', description: 'Track RSVPs and manage your guest list', href: '/guests', icon: Icons.Guests },
    { title: 'Theme Assistant', description: 'AI-powered theme brainstorming', href: '/themes', icon: Icons.ThemeAssistant },
    { title: 'Game Suggestions', description: 'Get personalized game ideas', href: '/games', icon: Icons.Games },
    { title: 'Checklist', description: 'Stay organized with tasks', href: '/checklist', icon: Icons.Checklist },
    { title: 'Budget Tracker', description: 'Manage expenses', href: '/budget', icon: Icons.Budget },
    { title: 'Registry Links', description: 'Share your wishlists', href: '/registry', icon: Icons.Registry },
    { title: 'Photo Gallery', description: 'Capture memories', href: '/gallery', icon: Icons.Gallery },
    { title: 'Thank You Helper', description: 'AI-generated thank you notes', href: '/thank-you-notes', icon: Icons.ThankYouHelper },
  ];

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary">Welcome back, {userProfile?.displayName || user?.email}!</h1>
            <p className="text-muted-foreground mt-2">Let's plan the perfect baby shower ✨</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

