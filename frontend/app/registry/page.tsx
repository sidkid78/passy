'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { RegistryLink } from '@/lib/types';
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';

const initialRegistryLinks: RegistryLink[] = [
  { id: '1', platformName: 'Amazon Baby Registry', url: 'https://www.amazon.com/baby-reg' },
  { id: '2', platformName: 'Target Baby Registry', url: 'https://www.target.com/gift-registry/baby-registry' },
  { id: '3', platformName: 'buybuy BABY', url: 'https://www.buybuybaby.com/store/registry' },
];

export default function RegistryLinksPage() {
  const [registryLinks, setRegistryLinks] = useState<RegistryLink[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<RegistryLink> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setRegistryLinks(initialRegistryLinks);
  }, []);

  const handleAddLink = () => {
    setCurrentLink({ platformName: '', url: '' });
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: RegistryLink) => {
    setCurrentLink(link);
    setIsDialogOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setRegistryLinks(registryLinks.filter(link => link.id !== linkId));
    toast({ title: "Link removed", description: "The registry link has been removed." });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  const handleSaveLink = () => {
    if (!currentLink || !currentLink.platformName || !currentLink.url) {
      toast({ variant: "destructive", title: "Error", description: "Platform name and URL are required." });
      return;
    }
    if (!isValidUrl(currentLink.url)) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid URL (e.g., https://example.com)." });
      return;
    }

    if (currentLink.id) {
      setRegistryLinks(registryLinks.map(link => link.id === currentLink.id ? currentLink as RegistryLink : link));
      toast({ title: "Link updated", description: "Registry link details have been updated." });
    } else {
      const newLink = { ...currentLink, id: String(Date.now()) } as RegistryLink;
      setRegistryLinks([...registryLinks, newLink]);
      toast({ title: "Link added", description: "New registry link added." });
    }
    setIsDialogOpen(false);
    setCurrentLink(null);
  };
  
  if (!isMounted) {
    return <p>Loading registry links...</p>;
  }

  return (
    <div>
      <PageHeader title="Registry Links" description="Manage and share your baby registry links.">
          <Button onClick={handleAddLink}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Registry Link
          </Button>
        </PageHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentLink?.id ? 'Edit Registry Link' : 'Add New Registry Link'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platformName" className="text-right">Platform</Label>
                <Input id="platformName" value={currentLink?.platformName || ''} onChange={(e) => setCurrentLink({...currentLink, platformName: e.target.value})} className="col-span-3" placeholder="e.g., Amazon, Target" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">URL</Label>
                <Input id="url" value={currentLink?.url || ''} onChange={(e) => setCurrentLink({...currentLink, url: e.target.value})} className="col-span-3" placeholder="https://www.example.com/registry" />
              </div>
            </div>
          <DialogFooter>
            <DialogClose>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveLink}>Save Link</Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {registryLinks.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="font-headline">No Registry Links Yet!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Add links to your baby registries from platforms like Amazon, Target, etc.</CardDescription>
              <Button onClick={handleAddLink}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Link
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registryLinks.map((link) => (
            <Card key={link.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{link.platformName}</CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-sm flex items-center">
                  {link.url} <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => handleEditLink(link)}>
                  <Edit className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(link.id)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
    </div>
  );
}

