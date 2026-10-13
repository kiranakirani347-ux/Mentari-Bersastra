import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
}

/**
 * Pembersih HTML untuk mencegah celah XSS pada perenderan Markdown.
 * Membersihkan skrip berbahaya, event handler inline, dan protokol URI yang rentan.
 */
function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  return dirtyHtml
    // Hapus script tags beserta isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Hapus iframe, embed, object
    .replace(/<\/?(iframe|embed|object)\b[^>]*>/gi, '')
    // Hapus atribut event handler inline (onclick, onerror, onload, onmouseover, dll)
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    // Hapus protokol berbahaya pada atribut href atau src (javascript:, vbscript:, data:text/html)
    .replace(/(href|src)\s*=\s*['"]?(?:javascript:|vbscript:|data:text\/html)[^'">\s]*['"]?/gi, '$1="#"');
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const htmlContent = useMemo(() => {
    try {
      const parsed = marked.parse(content || '', {
        gfm: true,
        breaks: true,
      }) as string;
      return sanitizeHtml(parsed);
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return `<p>${sanitizeHtml(content || '')}</p>`;
    }
  }, [content]);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
