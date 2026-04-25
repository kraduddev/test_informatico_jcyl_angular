import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { marked } from 'marked';
import mermaid from 'mermaid';

// ── Decode HTML entities that marked v18 encodes inside code blocks ───────────
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ── Configure marked globally (once) ─────────────────────────────────────────
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang === 'mermaid') {
        // marked v18 HTML-encodes the content; mermaid needs raw text
        return `<div class="mermaid">${decodeHtmlEntities(text)}</div>`;
      }
      return false; // fall back to default renderer
    }
  }
});

// ── Initialise mermaid globally (once) ───────────────────────────────────────
mermaid.initialize({ startOnLoad: false, theme: 'default' });

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
