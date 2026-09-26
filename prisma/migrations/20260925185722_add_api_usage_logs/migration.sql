-- CreateTable
CREATE TABLE "ApiUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "endpoint" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "statusCode" INTEGER,
    "requestTokens" INTEGER,
    "responseTokens" INTEGER,
    "totalTokens" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiUsageLog_userId_idx" ON "ApiUsageLog"("userId");

-- CreateIndex
CREATE INDEX "ApiUsageLog_provider_idx" ON "ApiUsageLog"("provider");

-- CreateIndex
CREATE INDEX "ApiUsageLog_success_idx" ON "ApiUsageLog"("success");

-- CreateIndex
CREATE INDEX "ApiUsageLog_createdAt_idx" ON "ApiUsageLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
