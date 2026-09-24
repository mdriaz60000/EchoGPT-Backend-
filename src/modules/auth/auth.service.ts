import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";
import { RegisterDto } from "./dto/login.dto";
import { LoginDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "Email already registered",
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      12,
    );

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      message: "Registration successful",
      user,
    };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Your account is inactive",
      );
    }

    const passwordMatched = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    const refreshToken = await this.generateRefreshToken(
      user.id,
    );

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    role: string,
  ) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      role,
    });
  }

  private async generateRefreshToken(
    userId: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "7d",
      },
    );
  }
}