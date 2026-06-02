import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VersionCheckQueryDto } from './dto/version-check-query.dto';

@SkipThrottle()
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is up' })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('version-check')
  @ApiOperation({ summary: 'Check if the client app version is supported' })
  @ApiQuery({ name: 'version', type: String, example: '1.0.0' })
  @ApiResponse({ status: 200, description: 'Version status returned' })
  @ApiResponse({ status: 400, description: 'Invalid version format' })
  versionCheck(@Query() query: VersionCheckQueryDto) {
    const minVersion = this.config.get<string>('min_app_version', '1.1.0');
    const isSupported = this.compareVersions(query.version, minVersion) >= 0;

    if (isSupported) {
      return { status: 'ok', minVersion };
    }

    return {
      status: 'blocked',
      minVersion,
      message: 'Update required to continue using the app.',
    };
  }

  private compareVersions(a: string, b: string): number {
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor > bMajor ? 1 : -1;
    if (aMinor !== bMinor) return aMinor > bMinor ? 1 : -1;
    if (aPatch !== bPatch) return aPatch > bPatch ? 1 : -1;
    return 0;
  }
}
