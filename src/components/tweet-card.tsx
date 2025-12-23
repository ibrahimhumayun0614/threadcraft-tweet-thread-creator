import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
interface TweetCardProps {
  text: string;
  index: number;
  total: number;
  onCopy: (text: string) => void;
}
export function TweetCard({ text, index, total, onCopy }: TweetCardProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const charCount = text.length;
  const isCloseToLimit = charCount > 260;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full flex flex-col border-border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/30">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            Tweet {index + 1} / {total}
          </span>
          <span className={`text-[10px] font-mono ${isCloseToLimit ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
            {charCount}/280
          </span>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground selection:bg-primary/20">
            {text}
          </p>
        </CardContent>
        <CardFooter className="p-3 border-t bg-muted/10 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-2 text-xs hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}