import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum ProviderType {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  GEMINI = "GEMINI",
}

export class CreateProviderDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(ProviderType)
  type: ProviderType;

  @IsString()
  @MinLength(10)
  apiKey: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}