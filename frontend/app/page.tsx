import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';

const quickLinks = [
  { title: 'Manage Guests', href: '/guests', icon: Icons.Guests, description: "Add, edit, and track RSVPs for your baby shower." },
  { title: 'Theme Assistant', href: '/themes', icon: Icons.ThemeAssistant, description: "Collaborate with an AI to brainstorm theme ideas." },
  { title: 'Plan Games', href: '/games', icon: Icons.Games, description: "Discover fun games for your guests." },
  { title: 'Registry Links', href: '/registry', icon: Icons.Registry, description: "Manage and share your gift registry links." },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Welcome to Passy!"
        description="Your all-in-one baby shower planning assistant. Let's make this celebration unforgettable!"
      />

      <section className="mb-12">
        <Card className="bg-primary/10 border-primary shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-2xl text-primary">Let's Get Planning!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-lg text-foreground mb-4">
                Planning a baby shower should be joyful, not stressful. Passy is here to guide you every step of the way, from managing your guest list to sending out thank you notes.
              </p>
              <p className="text-muted-foreground">
                Use the quick links below or the sidebar navigation to explore all the features. Happy planning!
              </p>
            </div>
            <div className="relative w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8YmFieXxlbnwwfHx8fDE3NTE2MDE1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Baby shower illustration" 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="baby shower party" 
                className="rounded-lg object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-foreground">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.title} passHref>
              <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <link.icon className="w-8 h-8 text-primary" />
                  <CardTitle className="font-headline text-xl">{link.title}</CardTitle>
                </CardHeader>
                <CardContent className="grow">
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
                <CardContent className="pt-0">
                   <Button variant="link" className="p-0 h-auto text-primary">
                    Go to {link.title.split(' ')[0]} <Icons.Dashboard className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

       <section className="mt-12">
        <h2 className="text-2xl font-headline font-semibold mb-6 text-foreground">More Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Icons.Checklist className="text-accent"/> Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Stay organized with a comprehensive to-do list.</p>
              <Link href="/checklist" passHref><Button variant="outline" size="sm">Open Checklist</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Icons.Budget className="text-accent"/> Budget Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Manage your expenses and stay on budget.</p>
              <Link href="/budget" passHref><Button variant="outline" size="sm">Track Budget</Button></Link>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Icons.ThankYouHelper className="text-accent"/> Thank You Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Generate personalized thank you notes with AI.</p>
              <Link href="/thank-you-notes" passHref><Button variant="outline" size="sm">Write Notes</Button></Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
