import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { ProvidersModule } from "./modules/providers/providers.module";
import { ChatModule } from "./modules/chat/chat.module";
import { UsageLogsModule } from "./modules/usageLogs/usageLogs.module";
import { WebSearchModule } from "./modules/webSearch/webSearch.module";


@Module({
  imports: [
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    ProvidersModule,
    ChatModule,
    UsageLogsModule,
    WebSearchModule
  ],
})
export class AppModule {}