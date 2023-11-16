import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FeatureAppLoggerService } from './feature-app-logger.service';
import { AppHistoryDtoPagination } from 'libs/apps/feature-app-history/src/lib/dto/AppHistoryDtoPagination';
import { PaginationMeta } from 'libs/utils/pagination/pagination';
import { PaginationQueryDto } from 'libs/utils/pagination/pagination-query.dto';
import { AppLogsDtoPagination } from './dto/AppLogsDtoPagination';
import { PaginationQueryNoLimitDto } from 'libs/utils/pagination/pagination-query-noLimit.dto';
import { readFileSync } from 'fs';

const prefix = 'apps-logs';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
export class FeatureAppLoggerController {
  constructor(private readonly appLoggerService: FeatureAppLoggerService) {}

  @Get(':appInstanceId')
  @ApiOperation({ operationId: 'getAppLogs' })
  @ApiOkResponse({ type: AppLogsDtoPagination })
  @ApiNotFoundResponse()
  async getAppLogs(
    @Query() pagination: PaginationQueryNoLimitDto,
    @Param('appInstanceId') appInstanceId: string,
  ) {
    if (!this.appLoggerService.appLogsExists(appInstanceId)) {
      throw new NotFoundException(`Logs for ${appInstanceId} not found`);
    }
    const logFiles = this.appLoggerService.getLogsFiles(appInstanceId);
    const { page } = pagination;
    const limit = 1;
    const offset = (page - 1) * limit;
    const logFilesFiltered = logFiles.slice(offset, offset + limit);
    const data = logFilesFiltered.map((logFile) => {
      return readFileSync(logFile, 'utf-8');
    });
    const response = new AppLogsDtoPagination();
    response.data = data;
    response.meta = PaginationMeta.from(page, limit, logFiles.length);
    return response;
  }
}
