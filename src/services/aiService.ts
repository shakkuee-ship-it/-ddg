// Enhanced AIService with proper integration
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  imageUrl?: string;
}

export class AIService {
  private apiKey = "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";
  private baseUrl = "https://openrouter.ai/api/v1";

  private models = {
    general: "qwen/qwen-2.5-72b-instruct:free",
    creative: "anthropic/claude-3-haiku:beta",
    code: "meta-llama/llama-3.1-8b-instruct:free",
    knowledge: "google/gemini-flash-1.5:free"
  };

  // Enhanced spell checking with AI
  async checkSpelling(text: string): Promise<string> {
    if (!text.trim()) return text;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://pandanexus.dev",
          "X-Title": "PandaNexus Spell Checker",
        },
        body: JSON.stringify({
          model: this.models.general,
          messages: [{
            role: "system",
            content: "You are a spell checker. Fix spelling, grammar, and punctuation errors. Return ONLY the corrected text, nothing else."
          }, {
            role: "user",
            content: `Fix this text: ${text}`
          }],
          temperature: 0.1,
          max_tokens: 500,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error(`Spell check failed: ${response.status}`);
      const data = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error("Spell check error:", error);
      // Fallback to basic corrections
      return this.basicSpellFix(text);
    }
  }

  // Basic spell corrections as fallback
  private basicSpellFix(text: string): string {
    if (!text) return "";
    let corrected = text
      .replace(/\bi\b/g, 'I')
      .replace(/\bteh\b/g, 'the')
      .replace(/\brecieve\b/g, 'receive')
      .replace(/\bdefinate\b/g, 'definite')
      .replace(/\bseperate\b/g, 'separate')
      .replace(/\bintergrated\b/g, 'integrated')
      .replace(/\bfrontendf\b/g, 'frontend')
      .replace(/\bmessase\b/g, 'message')
      .replace(/\bintergtar\b/g, 'integrate')
      .replace(/\bstrutiyre\b/g, 'structure')
      .replace(/\bmolre\b/g, 'more')
      .replace(/\battactive\b/g, 'attractive')
      .replace(/\bdeply\b/g, 'deploy')
      .replace(/\bresonve\b/g, 'responsive')
      .replace(/\bshahould\b/g, 'should')
      .replace(/\baswesome\b/g, 'awesome')
      .replace(/\bconatct\b/g, 'contact')
      .replace(/\batrractive\b/g, 'attractive')
      .replace(/\breponsive\b/g, 'responsive')
      .replace(/\bfic\b/g, 'fix')
      .replace(/\bchant\b/g, 'chat')
      .replace(/\bbuuton\b/g, 'button');

    // Capitalize first letter of sentences
    corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    
    // Add period if missing
    if (corrected && !/[.!?]$/.test(corrected.trim())) {
      corrected += ".";
    }
    
    return corrected;
  }

  // Enhanced AI chat with proper service routing
  async sendMessage(messages: AIMessage[], serviceType: string = 'general'): Promise<AIResponse> {
    // Ensure system message exists
    if (!messages.some(m => m.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: "You are PandaNexus, an advanced AI assistant created by Shakeel. Provide helpful, accurate, and engaging responses. Keep responses conversational and friendly."
      });
    }

    const lastMessage = messages[messages.length - 1];
    const isImageRequest = !!lastMessage.image || /generate.*image|create.*image|make.*image/i.test(lastMessage.content);
    
    // Select appropriate model based on service type
    let selectedModel = this.models.general;
    if (serviceType === 'code' || /code|programming|javascript|python|react/i.test(lastMessage.content)) {
      selectedModel = this.models.code;
    } else if (serviceType === 'creative' || /creative|story|poem|art/i.test(lastMessage.content)) {
      selectedModel = this.models.creative;
    } else if (serviceType === 'knowledge' || /explain|what is|how does/i.test(lastMessage.content)) {
      selectedModel = this.models.knowledge;
    }

    try {
      // Handle image generation
      if (isImageRequest && !lastMessage.image) {
        const imagePrompt = lastMessage.content.replace(/generate|create|make/gi, '').trim();
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=512&height=512&seed=${Date.now()}`;
        
        return {
          content: `I've generated an image for: "${imagePrompt}". Here's your custom AI-generated image!`,
          model: 'Pollinations AI',
          imageUrl
        };
      }

      // Format messages for API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.image ? [
          { type: "text", text: msg.content },
          { type: "image_url", image_url: { url: msg.image } }
        ] : msg.content
      }));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://pandanexus.dev',
          'X-Title': 'PandaNexus AI Chat'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: formattedMessages,
          temperature: serviceType === 'creative' ? 0.8 : 0.7,
          max_tokens: 1500,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response content received');
      }

      return {
        content: content,
        model: selectedModel,
        imageUrl: lastMessage.image
      };

    } catch (error) {
      console.error("AI Service Error:", error);
      
      // Enhanced fallback responses
      const fallbackResponses = [
        "I'm experiencing some technical difficulties right now. Please try again in a moment!",
        "Sorry, I'm having trouble connecting to my AI models. Let me try to help you anyway - what specifically do you need assistance with?",
        "There seems to be a temporary issue with my AI processing. Could you rephrase your question and I'll do my best to help?",
        "I'm currently having some connectivity issues, but I'm still here to help! What can I assist you with today?"
      ];
      
      return {
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        model: 'Fallback System'
      };
    }
  }
}

export const aiService = new AIService();