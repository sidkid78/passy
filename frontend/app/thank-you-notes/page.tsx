'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/src/hooks/use-toast';
import { generateThankYouNotes, type GenerateThankYouNotesInput, type GenerateThankYouNotesOutput } from '@/src/ai/flows/generate-thank-you-notes';
import { Loader2, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const formSchema = z.object({
  guestName: z.string().min(2, { message: "Guest name must be at least 2 characters." }),
  giftDescription: z.string().min(5, { message: "Gift description must be at least 5 characters." }),
  personalNote: z.string().optional(),
  tone: z.enum(['formal', 'informal', 'humorous']).default('informal'),
});

export default function ThankYouNotesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<GenerateThankYouNotesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateThankYouNotesInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: '',
      giftDescription: '',
      personalNote: '',
      tone: 'informal',
    },
  });

  const onSubmit = async (data: GenerateThankYouNotesInput) => {
    setIsLoading(true);
    setGeneratedNote(null);
    try {
      const result = await generateThankYouNotes(data);
      setGeneratedNote(result);
      toast({ title: "Thank You Note Generated!", description: "Your personalized thank you note is ready." });
    } catch (error) {
      console.error("Error generating thank you note:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message || "Failed to generate thank you note." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedNote?.thankYouNote) {
      navigator.clipboard.writeText(generatedNote.thankYouNote)
        .then(() => toast({ title: "Copied!", description: "Thank you note copied to clipboard." }))
        .catch(() => toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." }));
    }
  };

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="AI Thank You Note Helper" 
          description="Effortlessly generate personalized thank you notes for your baby shower gifts." 
        />

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Gift & Guest Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Aunt Mary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="giftDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gift Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., a beautiful handmade blanket, a set of adorable onesies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Touch (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., So lovely to see you! We really appreciate you coming." {...field} rows={3}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone of Note</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="informal">Informal & Friendly</SelectItem>
                          <SelectItem value="formal">Formal & Elegant</SelectItem>
                          <SelectItem value="humorous">Light & Humorous</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Note
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {generatedNote && (
          <Card className="mt-8 bg-primary/5 animate-in fade-in duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-primary">Generated Thank You Note</CardTitle>
                <CardDescription>Review and copy your personalized note.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy note">
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-background min-h-[150px] prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {generatedNote.thankYouNote}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

