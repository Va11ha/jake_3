import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { CategoriesController } from './categories.controller';
@Module({imports:[CoreModule],controllers:[CategoriesController]})
export class CategoriesModule {}
