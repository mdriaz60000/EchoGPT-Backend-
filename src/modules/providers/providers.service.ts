import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProviderDto } from "./dto/createProvider.dto";
import { prisma } from "../../lib/prisma";
import { UpdateProviderDto } from "./dto/updateProvider.dto";



@Injectable()
export class ProvidersService {

  // =========================
  // CREATE
  // =========================

  async create(data: CreateProviderDto) {
    const existingProvider =
      await prisma.aiProvider.findUnique({
        where: {
          type: data.type,
        },
      });

    if (existingProvider) {
      throw new ConflictException(
        `${data.type} provider already exists`,
      );
    }

    if (data.isDefault) {
      await prisma.aiProvider.updateMany({
        data: {
          isDefault: false,
        },
      });
    }

    const provider = await prisma.aiProvider.create({
      data: {
        name: data.name,
        type: data.type,
        apiKey: data.apiKey,
        isEnabled: data.isEnabled ?? true,
        isDefault: data.isDefault ?? false,
      },

      select: {
        id: true,
        name: true,
        type: true,
        isEnabled: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: "AI provider created successfully",
      provider,
    };
  }

  // =========================
  // GET ALL
  // =========================

  async findAll() {
    return prisma.aiProvider.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        isEnabled: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================
  // GET ONE
  // =========================

  async findOne(id: string) {
    const provider =
      await prisma.aiProvider.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          name: true,
          type: true,
          isEnabled: true,
          isDefault: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!provider) {
      throw new NotFoundException(
        "AI provider not found",
      );
    }

    return provider;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: string,
    data: UpdateProviderDto,
  ) {
    const provider =
      await prisma.aiProvider.findUnique({
        where: {
          id,
        },
      });

    if (!provider) {
      throw new NotFoundException(
        "AI provider not found",
      );
    }

    const updatedProvider =
      await prisma.aiProvider.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          apiKey: data.apiKey,
          isEnabled: data.isEnabled,
        },

        select: {
          id: true,
          name: true,
          type: true,
          isEnabled: true,
          isDefault: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      message: "AI provider updated successfully",
      provider: updatedProvider,
    };
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: string) {
    const provider =
      await prisma.aiProvider.findUnique({
        where: {
          id,
        },
      });

    if (!provider) {
      throw new NotFoundException(
        "AI provider not found",
      );
    }

    await prisma.aiProvider.delete({
      where: {
        id,
      },
    });

    return {
      message: "AI provider deleted successfully",
    };
  }

  // =========================
  // ENABLE / DISABLE
  // =========================

  async toggle(id: string) {
    const provider =
      await prisma.aiProvider.findUnique({
        where: {
          id,
        },
      });

    if (!provider) {
      throw new NotFoundException(
        "AI provider not found",
      );
    }

    const updatedProvider =
      await prisma.aiProvider.update({
        where: {
          id,
        },

        data: {
          isEnabled: !provider.isEnabled,
        },

        select: {
          id: true,
          name: true,
          type: true,
          isEnabled: true,
          isDefault: true,
        },
      });

    return {
      message: updatedProvider.isEnabled
        ? "AI provider enabled"
        : "AI provider disabled",

      provider: updatedProvider,
    };
  }

  // =========================
  // SET DEFAULT
  // =========================

  async setDefault(id: string) {
    const provider =
      await prisma.aiProvider.findUnique({
        where: {
          id,
        },
      });

    if (!provider) {
      throw new NotFoundException(
        "AI provider not found",
      );
    }

    if (!provider.isEnabled) {
      throw new ConflictException(
        "Disabled provider cannot be default",
      );
    }

    await prisma.aiProvider.updateMany({
      data: {
        isDefault: false,
      },
    });

    const updatedProvider =
      await prisma.aiProvider.update({
        where: {
          id,
        },

        data: {
          isDefault: true,
        },

        select: {
          id: true,
          name: true,
          type: true,
          isEnabled: true,
          isDefault: true,
        },
      });

    return {
      message: "Default provider updated",
      provider: updatedProvider,
    };
  }
}