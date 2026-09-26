import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from "@nestjs/common";

import { Role } from "../../generated/prisma/client";


import { Roles } from "../../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { RolesGuard } from "../../common/guards/roles.guards";
import { UpdateUserStatusDto } from "./dto/upadateUserStatusDto";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get("dashboard")
  getDashboard() {
    return this.adminService.getDashboard();
  }

@Get("users")
getUsers() {
  return this.adminService.getUsers();
}

@Patch("users/:id/status")
updateUserStatus(
  @Param("id") userId: string,
  @Body() data: UpdateUserStatusDto,
) {
  return this.adminService.updateUserStatus(
    userId,
    data.isActive,
  );
}


@Get("subscriptions")
getSubscriptions() {
  return this.adminService.getSubscriptions();
}

@Get("usage")
getUsageAnalytics() {
  return this.adminService.getUsageAnalytics();
}

@Get("providers")
getProviders() {
  return this.adminService.getProviders();
}

@Get("system-health")
getSystemHealth() {
  return this.adminService.getSystemHealth();
}

}