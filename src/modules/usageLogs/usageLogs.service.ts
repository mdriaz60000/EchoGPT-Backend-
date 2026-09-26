import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma";

@Injectable()
export class UsageLogsService {
  async create(data: {
    userId: string;
    provider: string;
    model?: string;
    endpoint: string;
    success: boolean;
    statusCode?: number;
    requestTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
    errorMessage?: string;
  }) {
    return prisma.apiUsageLog.create({
      data,
    });
  }

  async getUserLogs(userId: string) {
    return prisma.apiUsageLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAllLogs() {
    return prisma.apiUsageLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}