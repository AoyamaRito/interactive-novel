interface LumaGenerationRequest {
  prompt: string;
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9' | '9:21';
  model?: 'photon-1' | 'photon-flash-1';
}

interface LumaGenerationResponse {
  id: string;
  type: 'image';
  state: 'dreaming' | 'completed' | 'failed';
  failure_reason?: string;
  created_at: string;
  assets?: {
    image: string;
  };
  model: string;
  request: LumaGenerationRequest;
}

export class LumaClient {
  private apiKey: string;
  private baseUrl = 'https://api.lumalabs.ai/dream-machine/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'): Promise<LumaGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generations/image`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: aspectRatio,
        model: 'photon-1',
      }),
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getGeneration(generationId: string): Promise<LumaGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generations/${generationId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async waitForCompletion(generationId: string, maxAttempts = 30): Promise<LumaGenerationResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const generation = await this.getGeneration(generationId);
      
      if (generation.state === 'completed') {
        return generation;
      }
      
      if (generation.state === 'failed') {
        throw new Error(`Generation failed: ${generation.failure_reason || 'Unknown error'}`);
      }
      
      // 2秒待機
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Generation timeout');
  }
}