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
  const isCloseToLimit = charCount > 270;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="h-full flex flex-col border-border bg-card shadow-sm hover:shadow-md transition-all group">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/20 group-hover:bg-muted/40 transition-colors">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            Tweet {index + 1}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isCloseToLimit ? 'bg-destructive/10 text-destructive font-bold' : 'text-muted-foreground bg-muted'}`}>
            {charCount}/280
          </span>
        </CardHeader>
        <CardContent className="flex-1 p-5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground selection:bg-blue-500/20">
            {text}
          </p>
        </CardContent>
        <CardFooter className="p-3 border-t bg-muted/5 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePostOnX}
            className="h-8 gap-2 text-xs hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 transition-colors"
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
                <Check className="w-3.5 h-3.5 text-green-500" />
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