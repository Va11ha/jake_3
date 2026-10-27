import { Body, Controller, Get, Headers, Param, Post, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
@ApiTags('courses') @Controller('courses')
export class CoursesController {constructor(private readonly app:AppService){} @Get() list(){return this.app.listCourses()} @Get(':id') one(@Param('id') id:string){const c=this.app.listCourses().find(x=>x.id===id);if(!c)throw new NotFoundException('Курс не найден');return c} @Post() create(@Body() body:any,@Headers('authorization') h:string){this.app.requireRole(h,['admin']);return this.app.addCourse(body)} }
