import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";


import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { SendMessageDto } from "./dto/sendMessage.dto";


interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  // Send message
  @Post()
  sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() data: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      req.user.id,
      data,
    );
  }

  // Get user's conversations
  @Get("conversations")
  getConversations(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.chatService.getConversations(
      req.user.id,
    );
  }

  // Get conversation with messages
  @Get("conversations/:id")
  getConversation(
    @Req() req: AuthenticatedRequest,
    @Param("id") conversationId: string,
  ) {
    return this.chatService.getConversation(
      req.user.id,
      conversationId,
    );
  }

  // Delete conversation
  @Delete("conversations/:id")
  deleteConversation(
    @Req() req: AuthenticatedRequest,
    @Param("id") conversationId: string,
  ) {
    return this.chatService.deleteConversation(
      req.user.id,
      conversationId,
    );
  }
}