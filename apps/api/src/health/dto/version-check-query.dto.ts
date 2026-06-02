import { IsNotEmpty, Matches } from 'class-validator';

export class VersionCheckQueryDto {
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'version must be a valid semver string (e.g. 1.2.3)',
  })
  version: string;
}
