import axios from "axios";
import * as cheerio from "cheerio";
import { fetchRenderedHtml } from "./puppeteer.service";

export interface ParsedData {
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  images: string[];
  links: string[];
  html: string;
}

function extractFromHtml(html: string): ParsedData {
  const $ = cheerio.load(html);

  const title = $('title').text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  
  const h1: string[] = [];
  $('h1').each((_, el) => { h1.push($(el).text().trim()); });

  const h2: string[] = [];
  $('h2').each((_, el) => { h2.push($(el).text().trim()); });

  const images: string[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src) images.push(src);
  });

  const links: string[] = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href) links.push(href);
  });

  return { title, metaDescription, h1, h2, images, links, html };
}

export async function scrapeUrl(url: string, timeout: number = 10000): Promise<ParsedData> {
  try {
    // Layer 1: Axios Fetch
    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const body = response.data;
    if (typeof body !== 'string') throw new Error("Invalid response");

    const parsed = extractFromHtml(body);
    
    // Heuristic for "empty" or JS-dependent pages: No content in standard tags
    if (!parsed.title && parsed.h1.length === 0 && parsed.h2.length === 0 && body.length < 2000) {
      throw new Error("Insufficient content");
    }

    return parsed;
  } catch (error) {
    console.log(`Axios failed or returned insufficient content for ${url}. Falling back to Puppeteer.`);
    
    // Layer 3: JS-heavy fallback mechanism
    const jsHtml = await fetchRenderedHtml(url, timeout + 5000); // give a bit more time
    return extractFromHtml(jsHtml);
  }
}
