import React, { useState, useRef, ChangeEvent, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Scissors,
  Upload,
  Eraser,
  Copy,
  Info,
  Rocket,
  ChevronUp,
  FileText,
  X as CloseIcon,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TweetCard } from '@/components/tweet-card';
import { splitText } from '@/lib/splitter';
import { copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/utils';
export function HomePage() {
  const [inputText, setInputText] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const hidden = localStorage.getItem('threadcraft_onboarding_hidden');
    return !hidden;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = "Thread Craft | X Thread Creator";
  }, []);
  const wordCount = useMemo(() => {
    return inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  }, [inputText]);
  const handleSplit = () => {
    if (!inputText.trim()) {
      toast.error('Thread Craft: Please enter some content first.');
      return;
    }
    setIsSplitting(true);
    // Synthetic delay for professional feel
    setTimeout(() => {
      try {
        const chunks = splitText(inputText);
        setTweets(chunks);
        setIsSplitting(false);
        if (chunks.length > 0) {
          toast.success(`Thread Craft: Crafted ${chunks.length} posts successfully!`, {
            icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
          });
          setTimeout(() => {
            scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      } catch (error) {
        console.error('Split logic failure:', error);
        toast.error('Thread Craft: An error occurred while processing your text.');
        setIsSplitting(false);
      }
    }, 450);
  };
  const handleClear = () => {
    setInputText('');
    setTweets([]);
    toast.info('Thread Craft: Editor cleared.');
  };
  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('threadcraft_onboarding_hidden', 'true');
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
      toast.error('Thread Craft: Invalid format. Only .txt files are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        toast.success('Thread Craft: Document imported successfully.');
      }
    };
    reader.onerror = () => toast.error('Thread Craft: Error reading file.');
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
      toast.success('Thread Craft: Full thread structure copied to clipboard.');
    }
  };
  const handleStartFullThread = async () => {
    if (tweets.length === 0) return;
    const allText = formatThreadForClipboard(tweets);
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Thread Craft: Thread Ready!', {
        description: 'Structure copied. Opening the first post for you.',
      });
    }
    const url = `https://x.com/intent/post?text=${encodeURIComponent(tweets[0])}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="min-h-screen bg-slate-50/30 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header Section */}
          <header className="text-center space-y-4 mb-16 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-900">
                Thread <span className="text-blue-600">Craft</span>
              </h1>
              <p className="text-slate-500 max-w-xl mx-auto text-lg md:text-xl leading-relaxed font-medium mt-4">
                Transform long stories into perfectly sequenced X threads with zero friction.
              </p>
            </motion.div>
          </header>
          <main className="max-w-3xl mx-auto space-y-12 relative pb-20">
            {/* Onboarding / Tips Section */}
            <AnimatePresence mode="wait">
              {showOnboarding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 mb-10 max-w-2xl mx-auto relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <button
                      onClick={handleDismissOnboarding}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                      aria-label="Dismiss onboarding"
                    >
                      <CloseIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                    The Protocol
                  </h3>
                  <ol className="space-y-4 text-slate-600 font-medium list-none">
                    <li className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
                      <span>Input or <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">Import</code> your content to the engine.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
                      <span>Hit <strong className="text-slate-900">"Craft Thread"</strong> to generate optimized 280-char segments.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
                      <span>Copy segments sequentially or use <strong className="text-blue-600">"Start Posting"</strong> for an automated workflow.</span>
                    </li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Input Section */}
            <div className="relative group rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200/60 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-500">
              <Textarea
                placeholder="Paste your story here..."
                className="min-h-[450px] text-xl p-10 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-slate-300 font-medium leading-relaxed"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex items-center justify-between px-8 py-5 bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <FileText className="w-4 h-4 text-slate-300" />
                    <span>{wordCount.toLocaleString()}</span> Words
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <Sparkles className="w-4 h-4 text-slate-300" />
                    <span>{inputText.length.toLocaleString()}</span> Chars
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100/50">
                  <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">v1.4 Engine Protocol</span>
                </div>
              </div>
            </div>
            {/* Sticky Action Controls */}
            <div className="sticky bottom-10 z-40 px-4 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-2xl p-4 rounded-[1.5rem] border border-white shadow-2xl ring-1 ring-slate-200/50">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none h-14 px-6 rounded-2xl bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 gap-2 font-bold text-slate-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="flex-1 sm:flex-none h-14 px-6 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 gap-2 font-bold"
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Clear</span>
                  </Button>
                </div>
                <Button
                  size="lg"
                  onClick={handleSplit}
                  disabled={isSplitting || !inputText.trim()}
                  className={cn(
                    "w-full sm:w-auto h-14 px-12 rounded-2xl gap-3 font-black text-base shadow-xl transition-all active:scale-95",
                    "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                  )}
                >
                  {isSplitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Scissors className="w-5 h-5" />
                  )}
                  {isSplitting ? 'Processing...' : 'Craft Thread'}
                </Button>
              </div>
            </div>
            <div ref={scrollAnchorRef} className="h-4 -mt-20 invisible" />
            {/* Results Section */}
            <AnimatePresence>
              {tweets.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="mt-32 space-y-20"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-12 gap-8">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                        <CheckCircle2 className="w-3 h-3" /> Processing Complete
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Thread Preview</h2>
                      <p className="text-slate-500 text-lg font-medium">Your story is split into {tweets.length} high-impact posts.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white border-slate-200 font-bold text-slate-700 hover:bg-slate-50 gap-2" onClick={handleCopyAll}>
                        <Copy className="w-5 h-5" /> Copy Full Thread
                      </Button>
                      <Button variant="default" className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-2xl shadow-slate-900/20 gap-3 active:scale-95" onClick={handleStartFullThread}>
                        <Rocket className="w-5 h-5" /> Start Posting
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {tweets.map((tweet, index) => (
                      <TweetCard key={`${index}-${tweet.length}`} text={tweet} index={index} total={tweets.length} />
                    ))}
                  </div>
                  {/* Pro Guidance Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="py-12 px-8 text-center bg-slate-100/50 rounded-[2.5rem] border border-slate-200/60 max-w-3xl mx-auto"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900">Pro Guidance</h4>
                        <p className="text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
                          To publish a thread on X, post your first segment, then reply to it with the second, and so on. We've copied the full structure to your clipboard for reference.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <div className="flex justify-center pt-10">
                    <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group gap-3 text-slate-400 hover:text-slate-900 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                      <ChevronUp className="w-5 h-5 group-hover:-translate-y-2 transition-transform duration-300" /> Scroll to Top
                    </Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
            {/* Empty State */}
            {!tweets.length && !isSplitting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-32 text-center py-40 border-2 border-dashed border-slate-200 rounded-[4rem] bg-white/50 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative inline-block mb-10"
                >
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                  <Sparkles className="relative w-20 h-20 md:w-28 md:h-28 mx-auto text-blue-500/20 group-hover:text-blue-500/40 transition-colors duration-500" />
                </motion.div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 relative z-10">Waiting for your story</h3>
                <p className="text-slate-500 max-sm mx-auto font-semibold px-6 text-lg relative z-10">
                  Paste your thoughts above to generate your professional Thread Craft preview.
                </p>
              </motion.div>
            )}
          </main>
          {/* Footer */}
          <footer className="py-20 text-center border-t border-slate-200/60 mt-40">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-900 font-black tracking-tight text-lg">
                Thread <span className="text-blue-600">Craft</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} Thread Craft — Made with ❤️ by{' '}
                <a
                  href="https://wa.me/916380986703"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline transition-colors"
                >
                  Mohamed
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
      <Toaster richColors position="bottom-right" closeButton />
    </div>
  );
}