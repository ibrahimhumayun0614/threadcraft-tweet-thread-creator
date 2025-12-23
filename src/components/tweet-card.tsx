import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Twitter } from 'lucide-react';
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
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const charCount = text.length;
  // Character count color logic
  const getBadgeStyles = () => {
    if (charCount > 275) return 'bg-destructive/10 text-destructive font-bold border-destructive/20';
    if (charCount > 260) return 'bg-orange-500/10 text-orange-600 font-bold border-orange-500/20';
    return 'text-muted-foreground bg-muted border-transparent';
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="h-full flex flex-col border-border bg-white shadow-sm hover:shadow-md transition-all group overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-slate-50 group-hover:bg-slate-100 transition-colors border-b">
          <span className="text-[10px] font-black text-primary tracking-widest uppercase">
            Tweet {index + 1} of {total}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${getBadgeStyles()}`}>
            {charCount}/280
          </span>
        </CardHeader>
        <CardContent className="flex-1 p-5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground selection:bg-blue-500/20">
            {text}
          </p>
        </CardContent>
        <CardFooter className="p-3 border-t bg-slate-50/30 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePostOnX}
            className="h-8 gap-2 text-xs hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Part</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-2 text-xs hover:bg-accent transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
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