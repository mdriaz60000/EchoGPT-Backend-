import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { prisma } from "../../lib/prisma";
import { ChangePlanDto } from "./dto/changePlan.dto";



@Injectable()
export class SubscriptionsService {
  // =========================
  // GET SUBSCRIPTION
  // =========================

  async getSubscription(userId: string) {
    let subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    // First time হলে automatically FREE subscription
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: "FREE",
          status: "ACTIVE",
          requestLimit: 50,
          usedRequests: 0,
        },
      });
    }

    return subscription;
  }

  // =========================
  // CHANGE PLAN
  // =========================

  async changePlan(
    userId: string,
    data: ChangePlanDto,
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new NotFoundException(
        "Subscription not found",
      );
    }

    if (subscription.plan === data.plan) {
      throw new BadRequestException(
        `Already subscribed to ${data.plan} plan`,
      );
    }

    const requestLimit =
      data.plan === "PREMIUM"
        ? 1000
        : 50;

    const updatedSubscription =
      await prisma.subscription.update({
        where: {
          userId,
        },
        data: {
          plan: data.plan,
          status: "ACTIVE",
          requestLimit,
          usedRequests: 0,
          startedAt: new Date(),
        },
      });

    return {
      message: `Subscription changed to ${data.plan}`,
      subscription: updatedSubscription,
    };
  }

  // =========================
  // USAGE
  // =========================

  async getUsage(userId: string) {
    const subscription =
      await this.getSubscription(userId);

    const remainingRequests =
      Math.max(
        subscription.requestLimit -
          subscription.usedRequests,
        0,
      );

    return {
      plan: subscription.plan,
      status: subscription.status,
      requestLimit: subscription.requestLimit,
      usedRequests: subscription.usedRequests,
      remainingRequests,
    };
  }

  // =========================
  // INCREMENT USAGE
  // =========================

  async incrementUsage(userId: string) {
    const subscription =
      await this.getSubscription(userId);

    if (
      subscription.usedRequests >=
      subscription.requestLimit
    ) {
      throw new BadRequestException(
        "Request limit exceeded",
      );
    }

    return prisma.subscription.update({
      where: {
        userId,
      },
      data: {
        usedRequests: {
          increment: 1,
        },
      },
    });
  }
}