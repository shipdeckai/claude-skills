import { ImageProvider } from './base.js';
import { GenerateInput, EditInput, ProviderResult, ProviderError } from '../types.js';
import { logger } from '../util/logger.js';

/**
 * ModelsLab Provider
 *
 * Key features:
 * - Competitive pricing for image generation
 * - Fast inference times
 * - Multiple models including Flux, SDXL, Playground
 * - No content restrictions
 *
 * Excellent for:
 * - Cost-sensitive projects
 * - Uncensored content generation
 * - High-volume generation
 * - Alternative to Replicate/Fal
 */
export class ModelsLabProvider extends ImageProvider {
  readonly name = 'ModelsLab';

  private baseUrl = 'https://modelslab.com/api/v6';

  constructor() {
    super();
  }

  private getApiKey(): string | undefined {
    return process.env.MODELSLAB_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }

  getRequiredEnvVars(): string[] {
    return ['MODELSLAB_API_KEY'];
  }

  getCapabilities() {
    return {
      supportsGenerate: true,
      supportsEdit: false,
      supportsVariations: false,
      supportsUpscale: false,
      supportsControlNet: false,
      supportsCharacterConsistency: false,
      supportsCustomModels: true,
      maxWidth: 1024,
      maxHeight: 1024,
      defaultModel: 'flux',
      availableModels: [
        'flux',           // Flux - Fast, high quality
        'flux-realism',   // Flux Realism
        'flux-canny',     // Flux with Canny control
        'flux-depth',     // Flux with Depth control
        'playground-v2',  // Playground v2
        'playground-v2-5', // Playground v2.5
        'stable-diffusion-xl', // SDXL
        'sdxl-lightning', // SDXL Lightning (fast)
        'animagine-xl',   // Anime style
        'realvisxl-v4',   // Realistic
      ],
    };
  }

  async generate(input: GenerateInput): Promise<ProviderResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new ProviderError('MODELSLAB_API_KEY not configured');
    }

    const model = input.model || this.getCapabilities().defaultModel;

    logger.info(`Generating image with ModelsLab, model: ${model}`);

    try {
      const response = await fetch(`${this.baseUrl}/images/text2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: apiKey,
          prompt: input.prompt,
          negative_prompt: input.negativePrompt,
          width: input.width || 512,
          height: input.height || 512,
          samples: input.numImages || 1,
          guidance: input.guidance || 3.5,
          model,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ModelsLab API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      if (data.output && Array.isArray(data.output)) {
        return {
          images: data.output.map((img: string) => ({
            url: img,
            revisedPrompt: data.revised_prompt || input.prompt,
          })),
          provider: this.name,
        };
      }

      if (data.fetch_result) {
        // Async generation - poll for result
        return this.pollGeneration(apiKey, data.id, input);
      }

      throw new Error('Unexpected response format from ModelsLab');
    } catch (error) {
      throw new ProviderError(`ModelsLab generation failed: ${error}`);
    }
  }

  private async pollGeneration(apiKey: string, id: string, input: GenerateInput, retries = 10): Promise<ProviderResult> {
    for (let i = 0; i < retries; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(`${this.baseUrl}/images/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: apiKey, id }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.output) {
        return {
          images: data.output.map((img: string) => ({
            url: img,
            revisedPrompt: input.prompt,
          })),
          provider: this.name,
        };
      }

      if (data.status === 'failed') {
        throw new Error('Image generation failed on ModelsLab');
      }
    }

    throw new Error('Timeout waiting for ModelsLab image generation');
  }
}
