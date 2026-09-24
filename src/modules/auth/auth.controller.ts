import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/login.dto";
import { LoginDto } from "./dto/register.dto";


@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post("login")
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post("refresh")
  refreshToken(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data);
  }

  @Post("logout")
  logout(@Body() data: RefreshTokenDto) {
    return this.authService.logout(data);
  }
}