// AIService.ts
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: string; // optional uploaded image URL
}

export interface AIResponse {
  content: string;
  model: string;
  imageUrl?: string; // generated image URL
}

export class AIService {
  private apiKey = "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";
  private baseUrl = "https://openrouter.ai/api/v1";

  private models = {
    image: "google/gemini-2.5-flash-image-preview:free",
    general: "openai/gpt-3.5-turbo"
  };

  // Local spell/grammar fixes
  private localSpellFix(text: string): string {
    if (!text) return "";
    let corrected = text
      .replace(/\bi\b/g, 'I')
      .replace(/\bteh\b/g, 'the')
      .replace(/\brecieve\b/g, 'receive')
      .replace(/\bdefinate\b/g, 'definite')
      .replace(/\bseperate\b/g, 'separate');
    corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (m,p1,p2)=>p1+p2.toUpperCase());
    if (corrected && !/[.!?]$/.test(corrected.trim())) corrected += ".";
    return corrected;
  }

  // Send message to AI
  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    // Add system intro if first message
    if (!messages.some(m => m.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: "Hi! I am PandaNexus, built by Shakeel. I am your friendly AI assistant. How can I assist you?"
      });
    }

    const lastMessage = messages[messages.length - 1];
    // Trigger image generation if prompt contains "generate image" or uploaded image exists
    const isImage = !!lastMessage.image || /generate.*image/i.test(lastMessage.content);
    const selectedModel = isImage ? this.models.image : this.models.general;

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.image ? [
        { type: "text", text: this.localSpellFix(msg.content) },
        { type: "image_url", image_url: { url: msg.image } }
      ] : this.localSpellFix(msg.content)
    }));

    try {
      // If image generation requested, use Pollinations fallback
      if (isImage && !lastMessage.image) {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(lastMessage.content)}`;
        return {
          content: `Here’s your generated image for: ${lastMessage.content}`,
          model: 'Pollinations',
          imageUrl
        };
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: formattedMessages,
          temperature: isImage ? 0.7 : 0.3,
          max_tokens: 1200,
          stream: false
        })
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const data = await response.json();

      let imageUrl: string | undefined = undefined;
      if (isImage && lastMessage.image) {
        imageUrl = lastMessage.image;
      }

      return {
        content: data.choices?.[0]?.message?.content || lastMessage.content,
        model: selectedModel,
        imageUrl
      };
    } catch (error) {
      console.error("AIService Error:", error);
      return {
        content: "Hi! I am PandaNexus, built by Shakeel. I am your friendly AI assistant. How can I assist you?",
        model: selectedModel
      };
    }
  }
}

export const aiService = new AIService();
