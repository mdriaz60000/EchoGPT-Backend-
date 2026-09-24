// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
// } from "@nestjs/common";

// import { UsersService } from "./users.service";
// import { UpdateProfileDto } from "./dto/updateProfile.dto";


// @Controller("users")
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//   ) {}

//   @Get(":id")
//   getProfile(@Param("id") id: string) {
//     return this.usersService.findById(id);
//   }

//   @Patch(":id")
//   updateProfile(
//     @Param("id") id: string,
//     @Body() data: UpdateProfileDto,
//   ) {
//     return this.usersService.updateProfile(id, data);
//   }

//   @Delete(":id")
//   deleteAccount(@Param("id") id: string) {
//     return this.usersService.deleteAccount(id);
//   }
// }



import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwtAuthGuards";
import { UpdateProfileDto } from "./dto/updateProfile.dto";


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getProfile(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateProfile(
    @Param("id") id: string,
    @Body() data: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteAccount(@Param("id") id: string) {
    return this.usersService.deleteAccount(id);
  }
}