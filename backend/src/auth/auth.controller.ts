import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
 constructor(private readonly app:AppService){}
 @Post('register') register(@Body() body:any){return this.app.register(body)}
 @Post('login') login(@Body() body:any){return this.app.login(body)}
 @Get('me') me(@Headers('authorization') h:string){const user=this.app.requireUser(h);return {user:this.app.publicUser(user)}}
}
