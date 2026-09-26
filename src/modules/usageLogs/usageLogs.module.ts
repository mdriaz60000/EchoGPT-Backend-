import { Module } from "@nestjs/common";
import { UsageLogsController } from "./usageLogs.controller";
import { UsageLogsService } from "./usageLogs.service";

@Module({
  controllers: [UsageLogsController],
  providers: [UsageLogsService],
  exports: [UsageLogsService],
})
export class UsageLogsModule {}