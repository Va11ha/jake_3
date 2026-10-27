import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { CoursesController } from './courses.controller';
@Module({imports:[CoreModule],controllers:[CoursesController]})
export class CoursesModule {}
