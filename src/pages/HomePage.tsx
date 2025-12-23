import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Sparkles,
  Scissors,
  Upload,
  Twitter,
  Eraser,
  Copy,
  Info,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TweetCard } from '@/components/tweet-card';
import { splitText } from '@/lib/splitter';
import { copyToClipboard } from '@/lib/utils';
export function HomePage() {
  const [inputText, setInputText] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const handleSplit = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text first');
      return;
    }
    setIsSplitting(true);
    setTimeout(() => {
      const chunks = splitText(inputText);
      setTweets(chunks);
      setIsSplitting(false);
      toast.success(`Successfully split into ${chunks.length} tweets!`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }, 400);
  };
  const handleClear = () => {
    setInputText('');
    setTweets([]);
    toast.info('Cleared all content');
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('text.*') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a valid .txt file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        toast.success('File loaded successfully');
      }
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const formatThreadForClipboard = (items: string[]) => {
    return items.map((t, i) => {
      if (i === 0) return t;
      return `\n\n--- Tweet ${i + 1} ---\n\n${t}`;
    }).join('');
  };
  const handleCopyAll = async () => {
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) toast.success('Copied entire thread to clipboard');
  };
  const handleStartFullThread = async () => {
    if (tweets.length === 0) return;
    // 1. Copy formatted thread to clipboard
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Thread copied!', {
        description: 'Post first tweet, then reply to it with the remaining parts from your clipboard.',
        duration: 6000,
      });
    }
    // 2. Open first tweet in X
    const firstTweet = tweets[0];
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <header className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg text-primary-foreground">
              <Twitter className="w-8 h-8" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Thread<span className="text-blue-500">Craft</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-balance">
              Transform long-form content into perfectly formatted Twitter threads. Optimized for engagement and readability.
            </p>
          </div>
        </header>
        <main className="max-w-3xl mx-auto space-y-6">
          <div className="relative group">
            <Textarea
              placeholder="Paste your long article or thoughts here..."
              className="min-h-[300px] text-base p-6 resize-none shadow-sm transition-all focus:shadow-md border-2 focus:border-primary/20"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono bg-background/90 backdrop-blur-sm px-2 py-1 rounded border border-border shadow-sm">
              {inputText.length.toLocaleString()} chars
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4" />
                Upload .txt
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="gap-2 text-muted-foreground hover:text-destructive flex-1 sm:flex-none"
              >
                <Eraser className="w-4 h-4" />
                Clear
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleSplit}
              disabled={isSplitting || !inputText.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 gap-2 shadow-blue-500/20 shadow-lg active:scale-95 transition-transform"
            >
              {isSplitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              Split into Tweets
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300 shadow-sm"
          >
            <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />
            <p><strong>Pro Tip:</strong> Use the "Start Full Thread" button to copy everything at once and open the first post automatically.</p>
          </motion.div>
        </main>
        <AnimatePresence>
          {tweets.length > 0 && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-20 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    Your Thread
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {tweets.length} Tweets
                    </span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-10 px-4"
                    onClick={handleCopyAll}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 h-10 px-6 font-semibold shadow-lg shadow-blue-500/20"
                    onClick={handleStartFullThread}
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Start Full Thread</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tweets.map((tweet, index) => (
                  <TweetCard
                    key={`${index}-${tweet.length}`}
                    text={tweet}
                    index={index}
                    total={tweets.length}
                  />
                ))}
              </div>
              <div className="flex justify-center pt-12">
                <Button
                  variant="ghost"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-muted-foreground hover:bg-transparent hover:text-primary"
                >
                  Back to editor
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {tweets.length === 0 && !isSplitting && (
          <div className="mt-20 text-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/20">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">Your generated thread will appear here</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start by typing or uploading a file above</p>
          </div>
        )}
      </div>
      <footer className="py-12 text-center text-sm text-muted-foreground border-t mt-20">
        <div className="flex justify-center gap-4 mb-4">
          <Twitter className="w-4 h-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
        <p>© {new Date().getFullYear()} ThreadCraft. Minimalist & Fast.</p>
      </footer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}