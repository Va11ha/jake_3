import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { MaterialsController } from './materials.controller';
@Module({imports:[CoreModule],controllers:[MaterialsController]})
export class MaterialsModule {}
