
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getArtFeedback = async (imageData: string, currentTask: string) => {
  const model = 'gemini-3-flash-preview';
  
  const systemPrompt = `You are "Arty", a cool and encouraging art tutor for teenagers aged 11-15. 
  Your goal is to provide constructive, fun, and educational feedback on their drawings. 
  Keep your tone upbeat, use modern slang occasionally but appropriately, and focus on one or two specific art concepts (like composition, color theory, or line work).
  Always start with something you love about their work!`;

  const userPrompt = `I am working on this: "${currentTask}". Here is my current sketch. What do you think?`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageData.split(',')[1], // Remove the data:image/png;base64, prefix
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, { text: userPrompt }] },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Whoops! My artistic brain took a quick break. Can you try again? Your work is looking awesome anyway!";
  }
};

export const getNewCreativePrompt = async () => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Generate a weird, fun drawing prompt for a 13-year-old artist. Something like 'A skateboarding octopus wearing sunglasses'. Just the prompt text.",
      config: {
        systemInstruction: "You are a creative spark. Provide one short, imaginative drawing prompt.",
      },
    });
    return response.text;
  } catch (error) {
    return "Draw a robot having a tea party with a dinosaur!";
  }
};
