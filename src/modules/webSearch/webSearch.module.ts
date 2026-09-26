import { Module } from "@nestjs/common";
import { WebSearchController } from "./webSearch.controller";
import { WebSearchService } from "./webSearch.service";


@Module({
  controllers: [WebSearchController],
  providers: [WebSearchService],
})
export class WebSearchModule {}