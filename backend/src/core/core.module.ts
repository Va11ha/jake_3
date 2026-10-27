import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from '../app.service';
@Global()
@Module({imports:[JwtModule.register({secret:process.env.JWT_SECRET||'savevault-development-secret-change-me',signOptions:{expiresIn:'8h'}})],providers:[AppService],exports:[AppService,JwtModule]})
export class CoreModule {}
