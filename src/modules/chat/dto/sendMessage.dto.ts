import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export enum ChatProvider {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  GEMINI = "GEMINI",
}

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsOptional()
  @IsEnum(ChatProvider)
  provider?: ChatProvider;
}