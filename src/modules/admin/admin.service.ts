import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma";

@Injectable()
export class AdminService {
  async getDashboard() {
    const [
      totalUsers,
      activeUsers,
      totalSubscriptions,
      premiumUsers,
      totalProviders,
      enabledProviders,
      totalConversations,
      totalMessages,
      totalSearches,
      totalUsageLogs,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.subscription.count(),

      prisma.subscription.count({
        where: {
          plan: "PREMIUM",
          status: "ACTIVE",
        },
      }),

      prisma.aiProvider.count(),

      prisma.aiProvider.count({
        where: {
          isEnabled: true,
        },
      }),

      prisma.conversation.count(),

      prisma.message.count(),

      prisma.webSearch.count(),

      prisma.apiUsageLog.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },

      subscriptions: {
        total: totalSubscriptions,
        premium: premiumUsers,
        free: totalSubscriptions - premiumUsers,
      },

      providers: {
        total: totalProviders,
        enabled: enabledProviders,
        disabled: totalProviders - enabledProviders,
      },

      activity: {
        conversations: totalConversations,
        messages: totalMessages,
        webSearches: totalSearches,
        apiUsageLogs: totalUsageLogs,
      },
    };
  }

  async getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      subscription: {
        select: {
          plan: true,
          status: true,
          usedRequests: true,
          requestLimit: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

async updateUserStatus(
  userId: string,
  isActive: boolean,
) {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      isActive,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });
}

async getSubscriptions() {
  return prisma.subscription.findMany({
    select: {
      id: true,
      plan: true,
      status: true,
      requestLimit: true,
      usedRequests: true,
      startedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

async getUsageAnalytics() {
  const [
    totalRequests,
    successfulRequests,
    failedRequests,
    providerUsage,
  ] = await Promise.all([
    prisma.apiUsageLog.count(),

    prisma.apiUsageLog.count({
      where: {
        success: true,
      },
    }),

    prisma.apiUsageLog.count({
      where: {
        success: false,
      },
    }),

    prisma.apiUsageLog.groupBy({
      by: ["provider"],
      _count: {
        id: true,
      },
    }),
  ]);

  return {
    totalRequests,
    successfulRequests,
    failedRequests,

    successRate:
      totalRequests > 0
        ? Number(
            (
              (successfulRequests / totalRequests) *
              100
            ).toFixed(2),
          )
        : 0,

    providerUsage: providerUsage.map((item) => ({
      provider: item.provider,
      requests: item._count.id,
    })),
  };
}

async getProviders() {
  return prisma.aiProvider.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      isEnabled: true,
      isDefault: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

async getSystemHealth() {
  const startedAt = Date.now();

  let database = "healthy";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "unhealthy";
  }

  const databaseResponseTime = Date.now() - startedAt;

  const enabledProviders = await prisma.aiProvider.count({
    where: {
      isEnabled: true,
    },
  });

  const totalProviders = await prisma.aiProvider.count();

  return {
    status:
      database === "healthy" && enabledProviders > 0
        ? "healthy"
        : "degraded",

    timestamp: new Date().toISOString(),

    application: {
      status: "healthy",
      environment: process.env.NODE_ENV ?? "development",
    },

    database: {
      status: database,
      responseTimeMs: databaseResponseTime,
    },

    aiProviders: {
      status:
        enabledProviders > 0
          ? "healthy"
          : "unavailable",
      total: totalProviders,
      enabled: enabledProviders,
      disabled:
        totalProviders - enabledProviders,
    },

    uptime: {
      seconds: Math.floor(process.uptime()),
    },
  };
}

}