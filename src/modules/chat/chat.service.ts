import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";



import { SendMessageDto } from "./dto/sendMessage.dto";
import { prisma } from "../../lib/prisma";
import { AiProviderService } from "../providers/aiProvider.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly aiProviderService: AiProviderService,
  ) {}

  // -------------------------
  // Send message
  // -------------------------

  async sendMessage(
    userId: string,
    data: SendMessageDto,
  ) {
    // -------------------------
    // 1. Check subscription
    // -------------------------

    const subscription =
      await prisma.subscription.findUnique({
        where: {
          userId,
        },
      });

    if (!subscription) {
      throw new BadRequestException(
        "Subscription not found",
      );
    }

    if (subscription.status !== "ACTIVE") {
      throw new BadRequestException(
        "Your subscription is not active",
      );
    }

    if (
      subscription.usedRequests >=
      subscription.requestLimit
    ) {
      throw new BadRequestException(
        "Request limit exceeded",
      );
    }

    // -------------------------
    // 2. Find or create conversation
    // -------------------------

    let conversation;

    if (data.conversationId) {
      conversation =
        await prisma.conversation.findFirst({
          where: {
            id: data.conversationId,
            userId,
          },
        });

      if (!conversation) {
        throw new NotFoundException(
          "Conversation not found",
        );
      }
    } else {
      conversation =
        await prisma.conversation.create({
          data: {
            userId,
            title: data.message.slice(0, 50),
          },
        });
    }

    // -------------------------
    // 3. Select AI provider
    // -------------------------

    const provider =
      await prisma.aiProvider.findFirst({
        where: {
          isEnabled: true,

          ...(data.provider
            ? {
                type: data.provider,
              }
            : {
                isDefault: true,
              }),
        },
      });

    if (!provider) {
      throw new BadRequestException(
        "No active AI provider available",
      );
    }

    // -------------------------
    // 4. Save user message
    // -------------------------

    const userMessage =
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: data.message,
          provider: provider.type,
        },
      });

    // -------------------------
    // 5. Generate AI response
    // -------------------------

    const aiResponse =
      await this.aiProviderService.generateResponse(
        data.message,
      );

    // -------------------------
    // 6. Save AI response
    // -------------------------

    const assistantMessage =
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: aiResponse,
          provider: provider.type,
        },
      });

    // -------------------------
    // 7. Increment usage
    // -------------------------

    await prisma.subscription.update({
      where: {
        userId,
      },
      data: {
        usedRequests: {
          increment: 1,
        },
      },
    });

    // -------------------------
    // 8. Return response
    // -------------------------

    return {
      conversationId: conversation.id,

      userMessage,

      assistantMessage,

      usage: {
        usedRequests:
          subscription.usedRequests + 1,

        requestLimit:
          subscription.requestLimit,

        remainingRequests:
          subscription.requestLimit -
          (subscription.usedRequests + 1),
      },
    };
  }

  // -------------------------
  // Get all conversations
  // -------------------------

  async getConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        userId,
      },

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  // -------------------------
  // Get conversation
  // -------------------------

  async getConversation(
    userId: string,
    conversationId: string,
  ) {
    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },

        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        "Conversation not found",
      );
    }

    return conversation;
  }

  // -------------------------
  // Delete conversation
  // -------------------------

  async deleteConversation(
    userId: string,
    conversationId: string,
  ) {
    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        "Conversation not found",
      );
    }

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return {
      message: "Conversation deleted successfully",
    };
  }
}