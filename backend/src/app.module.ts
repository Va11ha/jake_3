import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { MaterialsModule } from './materials/materials.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';
import { AdminModule } from './admin/admin.module';
import { ActivityModule } from './activity/activity.module';
import { HealthController } from './health.controller';
@Module({imports:[CoreModule,AuthModule,MaterialsModule,CategoriesModule,CoursesModule,AdminModule,ActivityModule],controllers:[HealthController]})
export class AppModule {}
