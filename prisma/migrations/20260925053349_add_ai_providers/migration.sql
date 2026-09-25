-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('OPENAI', 'ANTHROPIC', 'GEMINI');

-- CreateTable
CREATE TABLE "AiProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiProvider_isEnabled_idx" ON "AiProvider"("isEnabled");

-- CreateIndex
CREATE INDEX "AiProvider_isDefault_idx" ON "AiProvider"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "AiProvider_type_key" ON "AiProvider"("type");
