import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import OpenAI from "openai";
import { envVars } from "../../config/env.config";

@Injectable()
export class AiProviderService {
  private readonly openai: OpenAI;

  constructor() {
    const apiKey =envVars.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured",
      );
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateResponse(
    prompt: string,
  ): Promise<string> {
    try {
      const response =
        await this.openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const content =
        response.choices[0]?.message?.content;

      if (!content) {
        throw new InternalServerErrorException(
          "AI returned an empty response",
        );
      }

      return content;
    } catch (error) {
      console.error("OpenAI Error:", error);

      throw new InternalServerErrorException(
        "Failed to generate AI response",
      );
    }
  }
}