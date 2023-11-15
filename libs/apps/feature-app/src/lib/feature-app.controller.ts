import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { FeatureAppService } from './feature-app.service';
import { AppDto } from './dto/AppDto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import { AppDetailsDto } from './dto/AppDetailsDto';
import { AppDtoPagination } from './dto/AppDtoPagination';
import { PaginationMeta } from 'libs/utils/pagination';
import { PaginationQueryDto } from 'libs/utils/pagination-query.dto';

const prefix = 'apps';

@Controller(prefix)
@ApiTags(prefix.toUpperCase())
export class FeatureAppController {
  constructor(
    private readonly appService: FeatureAppService,
    @InjectAppConfig() private readonly appConfig: AppConfiguration,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'getApps' })
  @ApiOkResponse({ type: AppDtoPagination })
  async getApps(@Query() pagination: PaginationQueryDto) {
    console.log(pagination);
    const apps = await this.appService.getAppsGroupByVersion();
    let data = apps.map((obj) => {
      const dto = AppDto.from(obj);
      return dto;
    });
    const limit = pagination.limit;
    const page = pagination.page;
    data = data.slice((page - 1) * limit, page * limit);
    const response = new AppDtoPagination();
    response.data = data;
    response.meta = PaginationMeta.from(page, limit, apps.length);
    return response;
  }

  @Get(':name')
  @ApiOperation({ operationId: 'getApp' })
  @ApiOkResponse({ type: AppDto })
  @ApiNotFoundResponse()
  async getApp(@Param('name') name: string) {
    const app = await this.appService.getAppGroupByVersion(name);
    if (!app) {
      throw new NotFoundException();
    }
    return AppDto.from(app);
  }

  @Delete(':name')
  @ApiOperation({ operationId: 'deleteAppAllVersions' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async deleteAppAllVersions(@Param('name') name: string) {
    await this.appService.removeAppAllVersions(name);
  }

  @Get(':name/:version')
  @ApiOperation({ operationId: 'getAppDetails' })
  @ApiOkResponse({ type: AppDetailsDto })
  @ApiNotFoundResponse()
  async getAppDetails(
    @Param('name') name: string,
    @Param('version') version: string,
  ) {
    const app = await this.appService.getApp(name, version);
    if (!app) {
      throw new NotFoundException();
    }
    return AppDetailsDto.from(app);
  }

  @Delete(':name/:version')
  @ApiOperation({ operationId: 'deleteAppVersion' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async deleteAppVersion(
    @Param('name') name: string,
    @Param('version') version: string,
  ) {
    await this.appService.removeApp(name, version);
  }
}
