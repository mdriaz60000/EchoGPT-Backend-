import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { prisma } from "../../lib/prisma";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateProfile(
    id: string,
    data: UpdateProfileDto,
  ) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteAccount(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await prisma.user.delete({
      where: { id },
    });

    return {
      message: "Account deleted successfully",
    };
  }

async changePassword(
  id: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const passwordMatched = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!passwordMatched) {
    throw new UnauthorizedException("Current password is incorrect");
  }

  const samePassword = await bcrypt.compare(
    newPassword,
    user.password,
  );

  if (samePassword) {
    throw new BadRequestException(
      "New password must be different from current password",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });

  // Existing sessions invalidate করা
  await prisma.session.deleteMany({
    where: {
      userId: id,
    },
  });

  return {
    message: "Password changed successfully",
  };
}

}