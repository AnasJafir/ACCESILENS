import { GoogleGenAI } from "@google/genai";
import { AppMode, Language } from "../types";
import { PROMPTS, SYSTEM_INSTRUCTION } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const analyzeImage = async (
  base64Image: string, 
  mode: AppMode, 
  language: Language,
  objectQuery?: string
): Promise<string> => {
  const ai = getClient();
  
  // Clean base64 string if it contains header
  const cleanBase64 = base64Image.split(',')[1];
  
  if (!cleanBase64) {
    console.error("Invalid image data");
    return language === 'fr' ? "Erreur image." : "Image error.";
  }

  let promptText = PROMPTS[language][mode];
  
  if (mode === AppMode.OBJECT) {
    const defaultObj = language === 'fr' ? "objet" : language === 'ar' ? "شيء" : "object";
    const query = objectQuery || defaultObj;
    promptText = promptText.replace("{OBJET}", query);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            },
            {
              text: promptText
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        maxOutputTokens: 250,
      }
    });

    let text = response.text || "";

    // CLEANUP: Aggressively strip Markdown and JSON formatting
    text = text.replace(/```json/gi, "").replace(/```/g, "");
    text = text.replace(/^json:/i, "");
    text = text.trim();
    
    // JSON Fallback parser
    if (text.startsWith("{") && text.endsWith("}")) {
        try {
            const parsed = JSON.parse(text);
            if (parsed.text) return parsed.text;
            if (parsed.description) return parsed.description;
            if (parsed.content) return parsed.content;
        } catch (e) {
            // Not valid JSON, ignore
        }
    }

    if (!text) {
        return language === 'fr' ? "Rien à signaler." : language === 'ar' ? "لا شيء للإبلاغ عنه." : "Nothing to report.";
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'fr' ? "Erreur de connexion." : language === 'ar' ? "خطأ في الاتصال." : "Connection error.";
  }
};