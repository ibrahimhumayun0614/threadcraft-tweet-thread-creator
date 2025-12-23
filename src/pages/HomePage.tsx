import { useState, useRef, ChangeEvent, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Scissors,
  Upload,
  X,
  Eraser,
  Copy,
  Info,
  Rocket,
  ChevronUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TweetCard } from '@/components/tweet-card';
import { splitText } from '@/lib/splitter';
import { copyToClipboard } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
export function HomePage() {
  const [inputText, setInputText] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = "Thread Craft | Professional X Thread Creator";
  }, []);
  const wordCount = useMemo(() => {
    return inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  }, [inputText]);
  const handleSplit = () => {
    if (!inputText.trim()) {
      toast.error('Thread Craft: Please enter some text first');
      return;
    }
    setIsSplitting(true);
    setTimeout(() => {
      const chunks = splitText(inputText);
      setTweets(chunks);
      setIsSplitting(false);
      toast.success(`Thread Craft: Crafted ${chunks.length} posts successfully!`);
      requestAnimationFrame(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }, 450);
  };
  const handleClear = () => {
    setInputText('');
    setTweets([]);
    toast.info('Thread Craft: Editor cleared');
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.txt')) {
      toast.error('Thread Craft: Only .txt files are supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        toast.success('Thread Craft: File imported successfully');
      }
    };
    reader.onerror = () => toast.error('Thread Craft: Failed to read file');
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const formatThreadForClipboard = (items: string[]) => {
    const separator = "──────────────────────────";
    return items.map((t, i) => `[Post ${i + 1}/${items.length}]\n${t}`).join(`\n\n${separator}\n\n`);
  };
  const handleCopyAll = async () => {
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Thread Craft: Full thread copied to clipboard');
    }
  };
  const handleStartFullThread = async () => {
    if (tweets.length === 0) return;
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Thread Craft: Story Ready!', {
        description: 'First post opened. The complete thread is saved to your clipboard.',
      });
    }
    const url = `https://x.com/intent/post?text=${encodeURIComponent(tweets[0])}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <AppLayout container className="min-h-screen bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
      <header className="text-center space-y-6 mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 text-white">
            <X className="w-9 h-9" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-foreground">
            Thread Craft
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Professional tools for long-form storytellers on X.
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto space-y-10 relative">
        <div className="relative group rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-border/50 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300">
          <Textarea
            placeholder="Paste your essay, article, or thoughts here..."
            className="min-h-[400px] text-lg p-8 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-border/50">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5" />
                <span className="font-mono">{wordCount.toLocaleString()}</span> Words
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-mono">{inputText.length.toLocaleString()}</span> Chars
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">Thread Craft Engine 1.1</span>
          </div>
        </div>
        <div className="sticky bottom-8 z-40">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/95 backdrop-blur-xl p-3 rounded-2xl border border-border shadow-2xl ring-1 ring-black/5">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none gap-2 rounded-xl h-12 bg-white border-border hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden xs:inline">Upload</span>
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="flex-1 sm:flex-none gap-2 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                <Eraser className="w-4 h-4" />
                <span className="hidden xs:inline">Clear</span>
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleSplit}
              disabled={isSplitting || !inputText.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-12 px-10 rounded-xl gap-3 shadow-lg shadow-blue-500/20 active:scale-95 transition-all font-bold"
            >
              {isSplitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              {isSplitting ? 'Crafting...' : 'Craft Thread'}
            </Button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex gap-4 text-sm text-blue-900/80"
        >
          <div className="bg-blue-100 p-2 rounded-xl h-fit shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="leading-relaxed font-medium">
            <strong>Engine Protocol:</strong> Thread Craft respects word integrity and protects formatting while automatically adding safe thread counters for X.
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
            className="mt-32 space-y-16"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-8 gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Thread Preview</h2>
                <p className="text-muted-foreground font-medium">Split into {tweets.length} parts for maximum engagement.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl bg-white" onClick={handleCopyAll}>
                  <Copy className="w-4 h-4" /> Copy All
                </Button>
                <Button variant="default" className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl font-bold shadow-xl shadow-blue-500/25" onClick={handleStartFullThread}>
                  <Rocket className="w-5 h-5" /> Start Thread
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tweets.map((tweet, index) => (
                <TweetCard key={`${index}-${tweet.length}`} text={tweet} index={index} total={tweets.length} />
              ))}
            </div>
            <div className="flex justify-center pt-16">
              <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group gap-2 text-muted-foreground hover:text-primary h-12 px-8 rounded-2xl font-semibold">
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> Back to Top
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {!tweets.length && !isSplitting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-24 text-center py-32 border-2 border-dashed border-border/60 rounded-[3rem] bg-white/30 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative inline-block mb-8"
          >
             <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
             <Sparkles className="relative w-16 h-16 md:w-20 md:h-20 mx-auto text-blue-500/30" />
          </motion.div>
          <h3 className="text-2xl font-black text-foreground mb-3">Ready for your story</h3>
          <p className="text-muted-foreground/80 max-w-sm mx-auto font-medium px-4">
            Your perfectly formatted Thread Craft cards will appear here after crafting.
          </p>
        </motion.div>
      )}
      <footer className="py-12 text-center border-t border-border/50 mt-24">
        <p className="text-sm font-bold text-muted-foreground/50 tracking-wider">
          © {new Date().getFullYear()} THREAD CRAFT — PROFESSIONAL STORYTELLING SUITE FOR X
        </p>
      </footer>
      <Toaster richColors position="bottom-right" closeButton />
    </AppLayout>
  );
}