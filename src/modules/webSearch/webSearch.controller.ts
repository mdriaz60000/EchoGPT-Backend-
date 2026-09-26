import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";


import { SearchDto } from "./dto/search.dto";

import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { WebSearchService } from "./webSearch.service";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller("web-search")
@UseGuards(JwtAuthGuard)
export class WebSearchController {
  constructor(
    private readonly webSearchService: WebSearchService,
  ) {}

  @Post()
  search(
    @Req() req: AuthenticatedRequest,
    @Body() data: SearchDto,
  ) {
    return this.webSearchService.search(
      req.user.id,
      data,
    );
  }

  @Get("history")
  getHistory(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.webSearchService.getHistory(
      req.user.id,
    );
  }
}