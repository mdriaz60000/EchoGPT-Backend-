import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { prisma } from "../../lib/prisma";
import { UpdateProfileDto } from "./dto/updateProfile.dto";



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
}