import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractStructuredData(html: string, type: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Using gemini-1.5-flash as it is fast and supports JSON schema
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    // Note: Some models support json response formatting, let's enforce output structure via prompt.
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  let prompt = '';

  if (type === 'product') {
    prompt = `
      Extract the following product details from the given HTML.
      Return strictly a JSON object matching this structure exactly (no markdown formatting outside of string content):
      {
        "type": "product",
        "title": "string",
        "price": "string",
        "currency": "string",
        "description": "string",
        "images": ["string"],
        "availability": "string"
      }
      If a field cannot be found, return an empty string or empty array.
    `;
  } else if (type === 'blog') {
    prompt = `
      Extract the following blog post details from the given HTML.
      Return strictly a JSON object matching this structure exactly:
      {
        "type": "blog",
        "title": "string",
        "author": "string",
        "published_date": "string",
        "content": "string",
        "images": ["string"]
      }
      If a field cannot be found, return an empty string or empty array.
    `;
  } else {
    prompt = `
      Extract key information from the given HTML website page.
      Return strictly a JSON object matching this structure exactly:
      {
        "type": "generic",
        "title": "string",
        "summary": "string",
        "links": ["string"]
      }
      If a field cannot be found, return an empty string or empty array.
    `;
  }

  prompt += `\n\nHTML Content:\n${html}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('LLM Extraction parsing Error:', error);
    throw new Error('Failed to extract structured data from LLM or invalid JSON generated');
  }
}
