import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma";
import { SearchDto } from "./dto/search.dto";

@Injectable()
export class WebSearchService {
  async search(
    userId: string,
    data: SearchDto,
  ) {
    // Temporary result
    const results = [
      {
        title: `Search result for "${data.query}"`,
        url: "https://example.com",
        snippet: "Temporary search result",
      },
    ];

    return prisma.webSearch.create({
      data: {
        userId,
        query: data.query,
        results,
      },
    });
  }

  async getHistory(userId: string) {
    return prisma.webSearch.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }
}