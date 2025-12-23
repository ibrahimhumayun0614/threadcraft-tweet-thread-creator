import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Sparkles,
  Scissors,
  Upload,
  Twitter,
  Eraser,
  Copy,
  Info,
  Rocket,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
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
    // Simulate minor processing delay for visual feedback
    setTimeout(() => {
      const chunks = splitText(inputText);
      setTweets(chunks);
      setIsSplitting(false);
      toast.success(`Thread Craft generated ${chunks.length} tweets!`);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }, 450);
  };
  const handleClear = () => {
    setInputText('');
    setTweets([]);
    toast.info('Thread Craft editor cleared');
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.txt')) {
      toast.error('Only .txt files are supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        toast.success('File content imported to Thread Craft');
      }
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const formatThreadForClipboard = (items: string[]) => {
    const separator = "──────────────────────────";
    return items.map((t, i) => `[Tweet ${i + 1}/${items.length}]\n${t}`).join(`\n\n${separator}\n\n`);
  };
  const handleCopyAll = async () => {
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Full Thread Craft thread copied');
    } else {
      toast.error('Failed to copy. Please try manual selection.');
    }
  };
  const handleStartFullThread = async () => {
    if (tweets.length === 0) return;
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Thread Craft is ready!', {
        description: 'First tweet opened. Full thread is in your clipboard.',
        duration: 5000,
      });
    } else {
      toast.warning('Note: Could not copy automatically', {
        description: 'We opened X for you, but you may need to copy segments manually.',
      });
    }
    const firstTweet = tweets[0];
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] min-h-screen font-sans">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 text-white">
              <Twitter className="w-9 h-9" />
            </div>
          </motion.div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-foreground">
              Thread Craft
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Transform your long-form content into viral-ready Twitter threads instantly.
            </p>
          </div>
        </header>
        <main className="max-w-3xl mx-auto space-y-8">
          <div className="relative group">
            <Textarea
              placeholder="Paste your essay, article, or thoughts here..."
              className="min-h-[350px] text-lg p-8 resize-none shadow-sm transition-all focus:shadow-2xl border-2 focus:border-blue-500/30 bg-white"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-4 left-4">
               <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest select-none">Editor Mode</span>
            </div>
            <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
              {inputText.length.toLocaleString()} characters
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 rounded-xl h-11 bg-white border-2 hover:bg-slate-50 transition-colors"
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
                className="gap-2 h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                <Eraser className="w-4 h-4" />
                Clear
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleSplit}
              disabled={isSplitting || !inputText.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-xl gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {isSplitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              {isSplitting ? 'Processing...' : 'Generate Thread'}
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-4 text-sm text-blue-900/80"
          >
            <div className="bg-blue-100 p-2 rounded-xl h-fit shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <p className="leading-relaxed">
              <strong>Splitter Engine:</strong> We automatically add numbering (e.g. 1/5) and ensure no words are cut in half. Long URLs are handled gracefully.
            </p>
          </motion.div>
        </main>
        <AnimatePresence>
          {tweets.length > 0 && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-24 space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tight">Thread Preview</h2>
                  <p className="text-muted-foreground">Your thread has been split into {tweets.length} parts.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 h-12 px-6 rounded-xl border-2 bg-white"
                    onClick={handleCopyAll}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </Button>
                  <Button
                    variant="default"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-bold shadow-xl shadow-blue-500/25"
                    onClick={handleStartFullThread}
                  >
                    <Rocket className="w-5 h-5" />
                    Start Thread
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tweets.map((tweet, index) => (
                  <TweetCard
                    key={`tweet-${index}-${tweet.length}`}
                    text={tweet}
                    index={index}
                    total={tweets.length}
                  />
                ))}
              </div>
              <div className="flex justify-center pt-16">
                <Button
                  variant="ghost"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group gap-2 text-muted-foreground hover:text-primary h-12 px-8 rounded-2xl"
                >
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Back to Top
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {!tweets.length && !isSplitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 text-center py-32 border-2 border-dashed border-border/60 rounded-[2.5rem] bg-white/50 backdrop-blur-sm"
          >
            <div className="relative inline-block mb-6">
               <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
               <Sparkles className="relative w-16 h-16 mx-auto text-blue-500/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Ready for your ideas</h3>
            <p className="text-muted-foreground/60 max-w-xs mx-auto">
              Your generated thread cards will appear here after processing.
            </p>
          </motion.div>
        )}
      </div>
      <footer className="py-16 text-center border-t border-border/50 mt-32">
        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-full bg-white border border-border shadow-sm hover:shadow-md transition-all"
          >
            <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </a>
        </div>
        <p className="text-sm font-medium text-muted-foreground/60">
          © {new Date().getFullYear()} Thread Craft. Built for modern storytellers.
        </p>
      </footer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}