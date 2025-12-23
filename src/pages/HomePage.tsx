import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Scissors, 
  Upload, 
  Twitter, 
  Eraser,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TweetCard } from '@/components/tweet-card';
import { splitText } from '@/lib/splitter';
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
    // Add a slight delay for better visual feedback
    setTimeout(() => {
      const chunks = splitText(inputText);
      setTweets(chunks);
      setIsSplitting(false);
      toast.success(`Split into ${chunks.length} tweets!`);
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
      toast.error('Please upload a .txt file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        toast.success('File uploaded successfully');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleCopyTweet = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  const handleCopyAll = () => {
    const allText = tweets.join('\n\n---\n\n');
    navigator.clipboard.writeText(allText);
    toast.success('Copied entire thread');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        {/* Hero Section */}
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
            <p className="text-muted-foreground max-w-lg mx-auto">
              Turn your long-form articles into perfectly formatted Twitter threads in seconds.
            </p>
          </div>
        </header>
        {/* Input Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="relative group">
            <Textarea
              placeholder="Paste your long text here..."
              className="min-h-[300px] text-base p-6 resize-none shadow-sm transition-all focus:shadow-md"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono bg-background/80 px-2 py-1 rounded">
              {inputText.length} characters
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
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
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <Eraser className="w-4 h-4" />
                Clear
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleSplit}
              disabled={isSplitting || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] gap-2 shadow-blue-500/20 shadow-lg"
            >
              {isSplitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              Split into Tweets
            </Button>
          </div>
        </div>
        {/* Results Section */}
        <AnimatePresence>
          {tweets.length > 0 && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-20 space-y-8"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Generated Thread
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {tweets.length} parts
                    </span>
                  </h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleCopyAll}
                >
                  <Copy className="w-4 h-4" />
                  Copy Entire Thread
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tweets.map((tweet, index) => (
                  <TweetCard
                    key={`${index}-${tweet.substring(0, 10)}`}
                    text={tweet}
                    index={index}
                    total={tweets.length}
                    onCopy={handleCopyTweet}
                  />
                ))}
              </div>
              <div className="flex justify-center pt-8">
                <Button
                  variant="ghost"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-muted-foreground"
                >
                  Back to Top
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {/* Empty State */}
        {tweets.length === 0 && !isSplitting && (
          <div className="mt-20 text-center py-20 border-2 border-dashed rounded-3xl opacity-40">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Generated tweets will appear here</p>
          </div>
        )}
      </div>
      <Toaster richColors position="bottom-center" />
      <footer className="py-12 text-center text-sm text-muted-foreground border-t mt-20">
        <p>© {new Date().getFullYear()} ThreadCraft. No data is stored on our servers.</p>
      </footer>
    </div>
  );
}