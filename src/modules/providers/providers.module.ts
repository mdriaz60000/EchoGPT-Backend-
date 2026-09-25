import { Module } from "@nestjs/common";

import { ProvidersController } from "./providers.controller";
import { ProvidersService } from "./providers.service";
import { AiProviderService } from "./aiProvider.service";


@Module({
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    AiProviderService,
  ],
  exports: [
    AiProviderService,
  ],
})
export class ProvidersModule {}