import React, { useMemo, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 预处理内容，确保表格和列表格式正确
  const processedContent = useMemo(() => {
    return content
      // 确保表格前后有空行
      .replace(/(\|[^\n]+\|\n)(\S)/g, '$1\n$2')
      .replace(/(\S)(\n\|[^\n]+\|)/g, '$1\n\n$2');
  }, [content]);

  // 在渲染后高亮搜索词
  useEffect(() => {
    if (!containerRef.current || !searchQuery || !searchQuery.trim()) {
      // 清除之前的高亮
      if (containerRef.current) {
        const marks = containerRef.current.querySelectorAll('mark.search-highlight');
        marks.forEach(mark => {
          const parent = mark.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
            parent.normalize();
          }
        });
      }
      return;
    }

    const container = containerRef.current;
    const query = searchQuery.trim();
    
    // 递归遍历文本节点并高亮
    const highlightTextNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        
        if (regex.test(text)) {
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          
          text.replace(regex, (match, p1, offset) => {
            // 添加匹配前的文本
            if (offset > lastIndex) {
              fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
            }
            
            // 添加高亮的匹配文本
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.textContent = match;
            fragment.appendChild(mark);
            
            lastIndex = offset + match.length;
            return match;
          });
          
          // 添加剩余文本
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
          }
          
          node.parentNode?.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // 跳过 code、pre、script 等标签
        const element = node as Element;
        if (!['CODE', 'PRE', 'SCRIPT', 'STYLE'].includes(element.tagName)) {
          Array.from(node.childNodes).forEach(highlightTextNodes);
        }
      }
    };

    // 延迟执行以确保 DOM 已渲染
    const timer = setTimeout(() => {
      highlightTextNodes(container);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery, processedContent]);

  return (
    <div ref={containerRef} className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <style>{`
        .prose mark.search-highlight {
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
