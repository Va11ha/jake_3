import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { AdminController } from './admin.controller';
@Module({imports:[CoreModule],controllers:[AdminController]})
export class AdminModule {}
