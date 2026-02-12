
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the NGODA AI Assistant for the NGODA AI LEARNING SCHOOL. 
Your goal is to help students learn about Artificial Intelligence, Machine Learning, and AI tools.
Be professional, encouraging, and educational. 
If asked about the course, mention modules like 'Introduction to AI', 'Machine Learning Basics', and 'AI Tools'.
Keep answers concise and accurate.`;

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const formattedHistory = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing connection issues. Please try again later.";
  }
};
