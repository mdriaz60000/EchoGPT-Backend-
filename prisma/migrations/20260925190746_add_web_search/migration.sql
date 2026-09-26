-- CreateTable
CREATE TABLE "WebSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebSearch_userId_idx" ON "WebSearch"("userId");

-- CreateIndex
CREATE INDEX "WebSearch_createdAt_idx" ON "WebSearch"("createdAt");

-- AddForeignKey
ALTER TABLE "WebSearch" ADD CONSTRAINT "WebSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
