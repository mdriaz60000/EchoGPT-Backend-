import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

;
import { ProvidersService } from "./providers.service";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { CreateProviderDto } from "./dto/createProvider.dto";
import { UpdateProviderDto } from "./dto/updateProvider.dto";
import { RolesGuard } from "../../common/guards/roles.guards";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../generated/prisma/enums";

@Controller("providers")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
  ) {}

  @Post()
  create(@Body() data: CreateProviderDto) {
    return this.providersService.create(data);
  }

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.providersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() data: UpdateProviderDto,
  ) {
    return this.providersService.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.providersService.remove(id);
  }

  @Patch(":id/toggle")
  toggle(@Param("id") id: string) {
    return this.providersService.toggle(id);
  }

  @Patch(":id/default")
  setDefault(@Param("id") id: string) {
    return this.providersService.setDefault(id);
  }
}