import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { copyToClipboard } from '@/lib/utils';
interface TweetCardProps {
  text: string;
  index: number;
  total: number;
}
export function TweetCard({ text, index, total }: TweetCardProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const handlePostOnX = () => {
    const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const charCount = text.length;
  const getBadgeStyles = () => {
    // Critical state: 275+ characters
    if (charCount > 275) return 'bg-destructive/10 text-destructive font-black border-destructive/20 ring-2 ring-destructive/10 shadow-sm animate-pulse';
    // Warning state: 250-274 characters
    if (charCount > 250) return 'bg-orange-500/10 text-orange-600 font-black border-orange-500/20';
    // Default professional state
    return 'text-blue-600 bg-blue-50 border-blue-100 font-bold';
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      layout
    >
      <Card className="h-full flex flex-col border-border bg-white shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors border-b">
          <span className="text-[11px] font-black text-slate-800 tracking-widest uppercase selection:bg-none">
            Post {index + 1} / {total}
          </span>
          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all duration-300 ${getBadgeStyles()}`}>
            {charCount}/280
          </span>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground selection:bg-blue-500/20 antialiased font-medium break-words">
            {text}
          </p>
        </CardContent>
        <CardFooter className="p-4 border-t bg-slate-50/10 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePostOnX}
            className="h-9 gap-2 text-xs font-bold hover:bg-slate-900 hover:text-white transition-all rounded-lg active:scale-95 group/btn"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Post on X</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-9 gap-2 text-xs font-bold hover:bg-slate-900 hover:text-white transition-all rounded-lg active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}