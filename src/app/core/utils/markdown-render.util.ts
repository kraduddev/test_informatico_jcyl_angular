import { marked } from 'marked';
import katex from 'katex';

/**
 * Renders a markdown string to HTML, correctly handling:
 * - LaTeX inline math  $...$
 * - LaTeX display math $$...$$
 * - Mermaid diagrams   ```mermaid ... ```  (handled by marked renderer in app.config)
 *
 * Strategy: extract LaTeX expressions as opaque placeholders BEFORE marked.parse()
 * so that marked never mangles the LaTeX syntax (escaping underscores, etc.).
 * After marked, restore placeholders with KaTeX-rendered HTML.
 */
export async function renderMarkdown(text: string): Promise<string> {
  const map = new Map<string, string>();
  let idx = 0;

  const placeholder = (rendered: string) => {
    const key = `XMATH${idx++}X`;
    map.set(key, rendered);
    return key;
  };

  // 1. Extract $$...$$ (display) — must run before inline $ regex
  let processed = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    const html = katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    return placeholder(html);
  });

  // 2. Extract $...$ (inline) — avoid matching $$ (already replaced above)
  processed = processed.replace(/\$([^\n$]+?)\$/g, (_, math) => {
    const html = katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    return placeholder(html);
  });

  // 3. Parse markdown (placeholders pass through untouched inside <p> tags)
  let html = await marked.parse(processed);

  // 4. Restore KaTeX HTML in place of each placeholder
  map.forEach((katexHtml, key) => {
    html = html.replace(key, katexHtml);
  });

  return html;
}

