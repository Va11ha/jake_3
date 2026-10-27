import { Body, Controller, Get, Headers, Param, Post, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
@ApiTags('categories') @Controller('categories')
export class CategoriesController {constructor(private readonly app:AppService){} @Get() list(){return this.app.listCategories()} @Get(':id') one(@Param('id') id:string){const c=this.app.listCategories().find(x=>x.id===id);if(!c)throw new NotFoundException('Категория не найдена');return c} @Post() create(@Body() body:any,@Headers('authorization') h:string){this.app.requireRole(h,['admin']);return this.app.addCategory(body)} }
