import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FeatureAppService } from './feature-app.service';
import { AppDto } from './dto/AppDto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppConfiguration,
  InjectAppConfig,
} from 'libs/config/utils-config/src';
import { AppDetailsDto } from './dto/AppDetailsDto';

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
  @ApiOkResponse({ type: [AppDto] })
  async getApps() {
    const apps = await this.appService.getAppsGroupByVersion();
    return apps.map((obj) => {
      const dto = AppDto.from(obj);
      return dto;
    });
  }

  @Get(':name')
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
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async deleteAppAllVersions(@Param('name') name: string) {
    await this.appService.removeAppAllVersions(name);
  }

  @Get(':name/:version')
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
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async deleteAppVersion(
    @Param('name') name: string,
    @Param('version') version: string,
  ) {
    await this.appService.removeApp(name, version);
  }
}
