import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  // Graceful fallback for demo or warn
  console.warn('GEMINI_API_KEY is not set. AI readings will fail.')
}

const genAI = new GoogleGenerativeAI(apiKey || "MOCK_KEY");
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Validates and formats the reading
 */
export async function generateKundliReading(
  chartData: any, 
  language: "en" | "hi" = "en"
): Promise<string> {
  const prompt = `
    Prompt: 
    You are a highly respected, traditional Vedic Astrologer. 
    You have been provided with mathematically 100% precise planetary positions for a native's Janam Kundli. 
    Do NOT hallucinate planetary degrees or signs. Strictly use the provided data.
    
    Data: 
    Lagna (Ascendant): ${chartData.lagna?.signName}
    Planets: ${chartData.planets?.map((p: any) => `${p.name} in ${p.signName} at ${p.degreeInSign?.toFixed(2)}°`).join(", ")}

    Please write a comprehensive, beautifully flowing, and respectful astrological reading. This is a PREMIUM paid tier reading, so make it exceptionally detailed and profound.
    Cover:
    1. The core personality influenced by the Lagna and Moon sign.
    2. Career and Wealth prospects based on key planetary placements.
    3. Major Dosha Analysis (Check for Manglik, Kalsarp, or any afflicted planet doshas based on the rigid planetary data provided).
    4. Vimshottari Dasha Overview & Year-wise Future Prediction (Provide a detailed futuristic outlook for the next 3 to 5 years).
    5. Highly specific spiritual and practical remedies.
    
    Format the response using Markdown with beautiful headers.
    Write the ENTIRE response fluently in ${language === 'hi' ? 'Hindi' : 'English'}.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Unable to generate reading at this time. Please ensure API limits/keys are valid.");
  }
}

export async function generateBasicKundliReading(
  chartData: any, 
  language: "en" | "hi" = "en"
): Promise<string> {
  const prompt = `
    You are a Vedic Astrologer providing a strictly FREE basic summary calculation.
    Data:
    Lagna: ${chartData.lagna?.signName}
    Moon: ${chartData.planets?.find((p:any) => p.name === 'Moon')?.signName}
    Sun: ${chartData.planets?.find((p:any) => p.name === 'Sun')?.signName}
    
    Write a very short (2 paragraphs max) introduction to their core identity based ONLY on the Lagna, Moon, and Sun signs.
    Do NOT include future predictions, remedies, or deep dosha analysis. Keep it basic and structured.
    At the end, add a gentle note: "For detailed year-wise predictions, dasa analysis, and remedies, please unlock the Detailed Pro Reading."
    
    Format the response using Markdown.
    Write the ENTIRE response fluently in ${language === 'hi' ? 'Hindi' : 'English'}.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("Unable to generate basic reading at this time.");
  }
}

export async function generateMatchmakingReading(
  boyChart: any, 
  girlChart: any, 
  score: number,
  language: "en" | "hi" = "en"
): Promise<string> {
  const prompt = `
    You are a highly respected, traditional Vedic Astrologer specializing in Kundli Milan (Matchmaking).
    You have been provided with precise planetary positions for a Boy and a Girl, and an initial Guna Milan score of ${score}/36.
    
    Boy Data:
    Moon Sign: ${boyChart.planets?.find((p:any) => p.name === 'Moon')?.signName}
    
    Girl Data:
    Moon Sign: ${girlChart.planets?.find((p:any) => p.name === 'Moon')?.signName}

    Please write a deeply insightful relationship prediction based on this compatibility score and Moon signs.
    Cover:
    1. Emotional Harmony (Mutual understanding based on the moon signs).
    2. Future Financial/Prosperity alignments together.
    3. Potential challenges they might face and spiritual remedies.
    4. Final verdict on their union.
    
    Format the response using Markdown with beautiful headers.
    Write the ENTIRE response fluently in ${language === 'hi' ? 'Hindi' : 'English'}.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Unable to generate reading at this time.");
  }
}

export async function generateNumerologyReading(
  name: string,
  lifePath: number,
  destiny: number,
  language: "en" | "hi" = "en"
): Promise<string> {
  const prompt = `
    You are a professional Numerologist.
    Client Name: ${name}
    Life Path Number: ${lifePath}
    Destiny (Expression) Number: ${destiny}

    Write a deep, premium numerology analysis covering:
    1. The significance of their Life Path number (life purpose).
    2. The significance of their Destiny number (natural talents and goals).
    3. How these two numbers interact for this specific person.
    4. A peek into their upcoming numerological cycles or generic lucky colors/gemstones based on these numbers.

    Format the response using beautiful Markdown headers.
    Write the ENTIRE response fluently in ${language === 'hi' ? 'Hindi' : 'English'}.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("Unable to generate numerology reading at this time.");
  }
}
