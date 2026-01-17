import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const getGeminiChat = (): Chat | null => {
  if (!aiClient) return null;

  return aiClient.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Royal Concierge of "Nainagarh Palace", a luxury resort in Varanasi styled after the grand palaces of Udaipur. 
      Your tone is elegant, polite, warm, and deeply respectful (using terms like 'Namaste', 'At your service', 'A truly royal choice').
      
      About the Resort:
      - Location: Outskirts of Varanasi, peaceful, lush gardens.
      - Architecture: Udaipur-style domes, jharokhas, white marble, intricate stone carvings.
      - Services: 5-star rooms, grand banquet halls for weddings, fine dining restaurant "The Darbar", and guided spiritual tours of Varanasi.
      
      Your goal is to assist guests with:
      - Explaining room amenities.
      - Suggesting dishes from our restaurant (Indian, Continental, Authentic Banarasi Satvik).
      - Describing our "Royal Kashi" tour packages.
      - Answering inquiries about wedding capacity (we host up to 2000 guests).
      
      Keep answers concise but luxurious. If asked about booking, guide them to use the forms on the website.`,
    },
  });
};

export const generateItinerary = async (preferences: string): Promise<string> => {
  if (!aiClient) return "Please configure the API Key to use the itinerary generator.";

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a custom 1-day itinerary for Varanasi for a guest staying at Nainagarh Palace. 
      Guest preferences: ${preferences}. 
      Include travel time from the outskirts (resort location) to the Ghats. 
      Format as a clean HTML list (<ul><li>...) without markdown code blocks. Keep it under 200 words.`,
    });
    return response.text || "I apologize, I could not generate an itinerary at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate itinerary. Please try again later.";
  }
};