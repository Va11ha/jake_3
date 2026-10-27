import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
@ApiTags('activity') @ApiBearerAuth() @Controller('activity')
export class ActivityController {constructor(private readonly app:AppService){} @Post() add(@Body() body:any,@Headers('authorization') h:string){return this.app.addActivity(body,this.app.requireUser(h))} @Get('me') mine(@Headers('authorization') h:string){return this.app.getActivity(this.app.requireUser(h))} }
