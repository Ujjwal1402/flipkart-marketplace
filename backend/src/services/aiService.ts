/**
 * AI Shopping Assistant Service (Flipkart Genie)
 * Powered by Google Gemini SDK with lazy client initialization & graceful fallback
 */
import { GoogleGenAI } from '@google/genai';
import { db } from '../../../database';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY') {
      try {
        aiClient = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.warn('[AI Service] Failed to initialize Gemini client:', err);
        return null;
      }
    }
  }
  return aiClient;
}

export class AiService {
  public static async askAssistant(query: string): Promise<{
    reply: string;
    suggestedProductIds?: string[];
  }> {
    const { products } = db.getProducts({ limit: 15 });
    const productCatalogSummary = products
      .map(
        (p) =>
          `ID: ${p.id} | Name: ${p.title} | Brand: ${p.brand} | Category: ${p.category} | Price: ₹${p.price} (MRP: ₹${p.mrp}) | Rating: ${p.rating}★ | Highlights: ${p.highlights.slice(0, 2).join(', ')}`
      )
      .join('\n');

    const client = getAiClient();

    if (client) {
      try {
        const prompt = `You are "Flipkart Smart Assistant", an expert, helpful e-commerce shopping advisor on Flipkart.
The user is asking: "${query}"

Here is the current live Flipkart catalog for reference:
${productCatalogSummary}

Guidelines:
1. Give a polite, concise, structured, and helpful response (under 160 words).
2. Recommend the best matching product(s) from the catalog when relevant. Mention exact price in ₹ and key advantage.
3. If they ask for comparisons, highlight key differences objectively.
4. At the very end, if you recommended specific products from the catalog, output their IDs in a bracketed format like: [SUGGESTED_IDS: prod-id1, prod-id2]`;

        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const text = response.text || '';
        let reply = text;
        const suggestedProductIds: string[] = [];

        const idMatch = text.match(/\[SUGGESTED_IDS:\s*([^\]]+)\]/i);
        if (idMatch && idMatch[1]) {
          const ids = idMatch[1].split(',').map((s) => s.trim());
          ids.forEach((id) => {
            if (db.getProductById(id)) {
              suggestedProductIds.push(id);
            }
          });
          reply = reply.replace(/\[SUGGESTED_IDS:\s*[^\]]+\]/i, '').trim();
        }

        return {
          reply,
          suggestedProductIds: suggestedProductIds.length > 0 ? suggestedProductIds : undefined
        };
      } catch (err) {
        console.error('[AI Assistant] Error calling Gemini:', err);
      }
    }

    // Fallback intelligent rules-based assistant when Gemini API key is not configured
    const lowerQuery = query.toLowerCase();
    const matchedProducts = products.filter(
      (p) =>
        lowerQuery.includes(p.brand.toLowerCase()) ||
        lowerQuery.includes(p.category.toLowerCase()) ||
        lowerQuery.includes(p.title.toLowerCase().slice(0, 8))
    );

    if (matchedProducts.length > 0) {
      const topMatch = matchedProducts[0];
      return {
        reply: `Here is the top recommendation for you: **${topMatch.title}** priced at just **₹${topMatch.price.toLocaleString('en-IN')}** (${topMatch.discountPercent}% off MRP ₹${topMatch.mrp.toLocaleString('en-IN')}). It has a ${topMatch.rating}★ rating with Flipkart Assured fast delivery!`,
        suggestedProductIds: matchedProducts.slice(0, 3).map((p) => p.id)
      };
    }

    return {
      reply: `I found great deals today! Check out the **Apple iPhone 15** (₹64,999) and **Sony WH-1000XM5 ANC Headphones** (₹26,990) with instant bank discounts up to 10% on Flipkart Axis Bank and HDFC cards. Let me know if you are shopping for Mobiles, Electronics, Fashion, or Appliances!`,
      suggestedProductIds: ['prod-iphone15', 'prod-sony-wh1000xm5']
    };
  }
}
