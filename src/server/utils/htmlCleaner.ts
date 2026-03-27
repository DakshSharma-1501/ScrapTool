import * as cheerio from "cheerio";

export function cleanHtml(html: string): string {
  const $ = cheerio.load(html);
  
  // Remove unnecessary tags
  $('script, style, noscript, svg, path, iframe, object, embed, footer, header').remove();
  
  // Clean up attributes that are not useful for content extraction
  $('*').each((i, el) => {
    const element = $(el);
    const attrs = element.attr();
    if (attrs) {
      for (const attr of Object.keys(attrs)) {
        if (!['href', 'src', 'alt'].includes(attr)) {
          element.removeAttr(attr);
        }
      }
    }
  });

  // Get text with some structure
  let cleaned = $('body').html() || '';
  
  // Remove multiple empty lines and spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Limit size to avoid overloading LLMs (roughly 50,000 chars is safe for most prompts)
  if (cleaned.length > 50000) {
    cleaned = cleaned.substring(0, 50000);
  }
  
  return cleaned;
}
