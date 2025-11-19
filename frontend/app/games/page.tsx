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
import { useToast } from '@/src/hooks/use-toast';
import { suggestBabyShowerGames, type SuggestBabyShowerGamesInput, type SuggestBabyShowerGamesOutput } from '@/src/ai/flows/suggest-baby-shower-games';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const formSchema = z.object({
  guestPreferences: z.string().min(10, { message: "Please describe your guests (min. 10 characters)." }),
  theme: z.string().min(3, { message: "Please provide a theme (min. 3 characters)." }),
});

export default function GameSuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestBabyShowerGamesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestBabyShowerGamesInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestPreferences: '',
      theme: '',
    },
  });

  const onSubmit = async (data: SuggestBabyShowerGamesInput) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestBabyShowerGames(data);
      setSuggestions(result);
      toast({ title: "Suggestions Ready!", description: "Here are some game ideas for your baby shower." });
    } catch (error) {
      console.error("Error generating game suggestions:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message || "Failed to get game suggestions." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="AI Game Planner" 
          description="Get personalized baby shower game suggestions based on your guests and theme." 
        />

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Tell us about your party</CardTitle>
            <CardDescription>The more details you provide, the better the suggestions!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guestPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Mixed ages, mostly family, love active games / prefer relaxed activities, etc."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baby Shower Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Woodland, Twinkle Little Star, Nautical" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Get Game Ideas
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {suggestions && (
          <Card className="mt-8 bg-primary/5 animate-in fade-in duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Game Suggestions</CardTitle>
              <CardDescription>Here are some fun ideas for your baby shower!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {suggestions.gameSuggestions}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

