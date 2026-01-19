import React, { useMemo } from 'react';
import { Streamdown } from 'streamdown';
import { cn } from '@/lib/utils';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  searchQuery?: string;
}

export function MarkdownRenderer({ content, className, searchQuery }: MarkdownRendererProps) {
  // 预处理内容，确保表格和列表格式正确
  const processedContent = useMemo(() => {
    let processed = content
      // 确保表格前后有空行
      .replace(/(\|[^\n]+\|\n)(\S)/g, '$1\n$2')
      .replace(/(\S)(\n\|[^\n]+\|)/g, '$1\n\n$2');
    
    // 如果有搜索词，高亮显示（使用 markdown 的 == 语法）
    if (searchQuery && searchQuery.trim()) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      processed = processed.replace(regex, '==$1==');
    }
    
    return processed;
  }, [content, searchQuery]);

  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <style>{`
        .prose mark {
          background-color: #fef08a;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }
        .prose .katex {
          font-size: 1.05em;
        }
        .prose .katex-display {
          margin: 1.5em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
      `}</style>
      <Streamdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {processedContent}
      </Streamdown>
    </div>
  );
}
