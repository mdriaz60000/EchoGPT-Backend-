import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/login.dto";
import { prisma } from "../../lib/prisma";
import { LoginDto } from "./dto/register.dto";


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // =========================
  // REGISTER
  // =========================

  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

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

  // =========================
  // LOGIN
  // =========================

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Your account is inactive");
    }

    const passwordMatched = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    const refreshToken = await this.generateRefreshToken(user.id);

    // Store refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

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

  // =========================
  // REFRESH TOKEN
  // =========================

  async refreshToken(data: RefreshTokenDto) {
    let payload: { sub: string };

    try {
      payload = await this.jwtService.verifyAsync(data.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const session = await prisma.session.findFirst({
      where: {
        userId: payload.sub,
        refreshToken: data.refreshToken,
      },
    });

    if (!session) {
      throw new UnauthorizedException("Refresh session not found");
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      throw new UnauthorizedException("Refresh token expired");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User is not active");
    }

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    return {
      message: "Access token refreshed",
      accessToken,
    };
  }

  // =========================
  // LOGOUT
  // =========================

  async logout(data: RefreshTokenDto) {
    await prisma.session.deleteMany({
      where: {
        refreshToken: data.refreshToken,
      },
    });

    return {
      message: "Logout successful",
    };
  }

  // =========================
  // ACCESS TOKEN
  // =========================

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

  // =========================
  // REFRESH TOKEN
  // =========================

  private async generateRefreshToken(userId: string) {
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