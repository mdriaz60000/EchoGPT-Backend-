import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";


import { SubscriptionsService } from "./subscriptions.service";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { ChangePlanDto } from "./dto/changePlan.dto";

@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Get()
  getSubscription(@Req() req: Request) {
    const user = req.user as {
      id: string;
    };

    return this.subscriptionsService.getSubscription(
      user.id,
    );
  }

  @Patch("plan")
  changePlan(
    @Req() req: Request,
    @Body() data: ChangePlanDto,
  ) {
    const user = req.user as {
      id: string;
    };

    return this.subscriptionsService.changePlan(
      user.id,
      data,
    );
  }

  @Get("usage")
  getUsage(@Req() req: Request) {
    const user = req.user as {
      id: string;
    };

    return this.subscriptionsService.getUsage(
      user.id,
    );
  }
}


