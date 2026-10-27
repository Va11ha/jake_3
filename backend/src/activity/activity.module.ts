import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ActivityController } from './activity.controller';
@Module({imports:[CoreModule],controllers:[ActivityController]})
export class ActivityModule {}
