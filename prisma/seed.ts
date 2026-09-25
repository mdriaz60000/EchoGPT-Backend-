
import * as bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { envVars } from "../src/config/env.config";

const connectionString = envVars.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@echogpt.com";
  const password = "Admin@123456";

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      role: "ADMIN",
      isActive: true,
    },

    create: {
      name: "EchoGPT Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log("Admin created/updated:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });