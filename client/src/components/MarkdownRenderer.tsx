import React from 'react';
import { Streamdown } from 'streamdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 预处理内容，确保表格和列表格式正确
  const processedContent = content
    // 确保表格前后有空行
    .replace(/(\|[^\n]+\|\n)(\S)/g, '$1\n$2')
    .replace(/(\S)(\n\|[^\n]+\|)/g, '$1\n\n$2');

  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <Streamdown>{processedContent}</Streamdown>
    </div>
  );
}
