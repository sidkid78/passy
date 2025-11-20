'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';

export default function PhotoGalleryPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = () => {
    toast({ title: "Coming Soon!", description: "Photo upload feature will be available soon." });
  };

  if (!isMounted) {
    return <p>Loading gallery...</p>;
  }

  return (
    <div>
      <PageHeader title="Photo Gallery & Memories" description="Relive the joyful moments from the baby shower.">
          <Button onClick={handleUpload}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Photos
          </Button>
        </PageHeader>

        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="font-headline">Gallery is Empty!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">No photos have been added yet. Start by uploading your favorite moments!</CardDescription>
            <Button onClick={handleUpload}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}

