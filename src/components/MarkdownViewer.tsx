import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const htmlContent = useMemo(() => {
    try {
      return marked.parse(content || '') as string;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
