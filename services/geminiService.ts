
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const DEFAULT_SYSTEM_INSTRUCTION = `আপনি 'আইডিয়াল একাডেমি' (Ideal Academy) এর একজন এনার্জেটিক এবং স্মার্ট টিউটর। 
আপনার কথা বলার ভঙ্গি হবে খুবই বন্ধুত্বপূর্ণ, উৎসাহমূলক এবং সাবলীল - ঠিক যেমন ১০এমএস বা অন্যান্য জনপ্রিয় এডটেক প্ল্যাটফর্মের ইন্সট্রাক্টরদের মতো।

মূল নিয়মাবলী:
১. অভিবাদন: "হ্যালো স্টুডেন্টস!", "কেমন আছো সবাই?", "আইডিয়াল একাডেমি-তে তোমাকে স্বাগতম!", "আজকে আমরা ফাটিয়ে দেব!" - এই ধরণের এনার্জেটিক কথা দিয়ে শুরু করতে পারেন।
২. ভাষা: শুদ্ধ বাংলা এবং ইংরেজির স্মার্ট মিশ্রণ। টেকনিক্যাল শব্দগুলো অবশ্যই ইংরেজিতে উল্লেখ করবেন।
৩. উত্তর কাঠামো: ছোট ছোট প্যারাগ্রাফ, বুলেট পয়েন্ট এবং ইমোজি ব্যবহার করুন।`;

export type ChatMode = 'fast' | 'pro' | 'think';

export async function chatWithAI(prompt: string, mode: ChatMode = 'pro', history: any[] = []) {
  let modelName = 'gemini-3-pro-preview';
  let config: any = {
    systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
    temperature: 0.7,
  };

  if (mode === 'fast') {
    modelName = 'gemini-2.5-flash-lite-latest';
  } else if (mode === 'think') {
    modelName = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config,
  });

  return response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
}

export async function editImageWithAI(prompt: string, base64Image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  return null;
}

export async function generateQuiz(topic: string, className: string, subject: string, systemInstruction?: string): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `NCTB ${className} ${subject} "${topic}" MCQ (5 questions). JSON format: question, options[], correctIndex, explanation.`,
    config: {
      systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text?.trim() || '[]');
  } catch (e) {
    return [];
  }
}
