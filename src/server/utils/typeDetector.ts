export function detectPageType(html: string, url: string): "product" | "blog" | "generic" {
  const lowerHtml = html.toLowerCase();
  
  // Product heuristics
  if (
    lowerHtml.includes('add to cart') ||
    lowerHtml.includes('buy now') ||
    /\/product\/|\/item\/|\/p\//.test(url)
  ) {
    return 'product';
  }

  // Blog heuristics
  if (
    lowerHtml.includes('<article') ||
    lowerHtml.includes('published on') ||
    lowerHtml.includes('written by') ||
    /\/blog\/|\/article\/|\/news\//.test(url)
  ) {
    return 'blog';
  }

  return 'generic';
}
