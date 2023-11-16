import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationMeta } from 'libs/utils/pagination/pagination';
import { PaginationQueryDto } from 'libs/utils/pagination/pagination-query.dto';
import { AppHistoryDtoPagination } from './dto/AppHistoryDtoPagination';
import {
  FeatureAppHistoryService,
  HistoryEntry,
} from './feature-app-history.service';
import { AppDtoPagination } from 'libs/apps/feature-app/src/lib/dto/AppDtoPagination';

const prefix = 'apps-history';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
export class FeatureAppHistoryController {
  constructor(private readonly appHistoryService: FeatureAppHistoryService) {}

  private convert(
    historyEntries: HistoryEntry[],
    page: number,
    limit: number,
    total: number,
  ): AppHistoryDtoPagination {
    const results = historyEntries.map((entry) =>
      this.appHistoryService.populateHistoryEntry(entry),
    );
    this.appHistoryService.sortHistoryEntries(results);
    const response = new AppHistoryDtoPagination();
    response.data = results;
    response.meta = PaginationMeta.from(page, limit, total);
    return response;
  }

  @Get()
  @ApiOperation({ operationId: 'getAppsHistory' })
  @ApiOkResponse({ type: AppHistoryDtoPagination })
  async getAppsHistory(@Query() pagination: PaginationQueryDto) {
    const history = this.appHistoryService.getAllHistory();
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const entries = history.slice(startIndex, endIndex);
    return this.convert(entries, page, limit, history.length);
  }

  @Get(':name')
  @ApiOperation({ operationId: 'getAppHistory' })
  @ApiOkResponse({ type: AppHistoryDtoPagination })
  async getAppHistory(
    @Query() pagination: PaginationQueryDto,
    @Param('name') name: string,
  ) {
    const history = this.appHistoryService.getHistoryForApp(name);
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const entries = history.slice(startIndex, endIndex);
    return this.convert(entries, page, limit, history.length);
  }

  @Get(':name/:version')
  @ApiOperation({ operationId: 'getAppVersionHistory' })
  @ApiOkResponse({ type: AppHistoryDtoPagination })
  async getAppVersionHistory(
    @Query() pagination: PaginationQueryDto,
    @Param('name') name: string,
    @Param('version') version: string,
  ) {
    const history = this.appHistoryService.getHistoryForAppVersion(
      name,
      version,
    );
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const entries = history.slice(startIndex, endIndex);
    return this.convert(entries, page, limit, history.length);
  }
}
