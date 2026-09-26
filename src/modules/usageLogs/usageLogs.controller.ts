import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { UsageLogsService } from "./usageLogs.service";



interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller("usage-logs")
@UseGuards(JwtAuthGuard)
export class UsageLogsController {
  constructor(
    private readonly usageLogsService: UsageLogsService,
  ) {}

  @Get()
  getMyLogs(@Req() req: AuthenticatedRequest) {
    return this.usageLogsService.getUserLogs(
      req.user.id,
    );
  }
}