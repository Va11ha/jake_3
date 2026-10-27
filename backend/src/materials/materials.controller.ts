import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, UseInterceptors, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { AppService } from '../app.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';
@ApiTags('materials')
@Controller('materials')
export class MaterialsController {
 constructor(private readonly app:AppService){}
 @Get() list(@Query() q:any,@Headers('authorization') h?:string){return this.app.listMaterials(q,this.app.userFromHeader(h))}
 @Get(':id') one(@Param('id') id:string,@Headers('authorization') h?:string){return this.app.getMaterial(id,this.app.userFromHeader(h))}
 @Post() @ApiBearerAuth() @ApiConsumes('multipart/form-data') @UseInterceptors(FileInterceptor('file',{storage:diskStorage({destination:join(__dirname,'..','uploads'),filename:(_req,file,cb)=>cb(null,randomUUID()+extname(file.originalname))}),limits:{fileSize:20*1024*1024}})) create(@Body() body:CreateMaterialDto,@UploadedFile() file:any,@Headers('authorization') h:string){const user=this.app.requireRole(h,['teacher','admin']);return this.app.createMaterial({...body,file_path:file?`/uploads/${file.filename}`:null},user)}
 @Patch(':id') @ApiBearerAuth() update(@Param('id') id:string,@Body() body:UpdateMaterialDto,@Headers('authorization') h:string){return this.app.updateMaterial(id,body,this.app.requireUser(h))}
 @Put(':id') @ApiBearerAuth() updatePut(@Param('id') id:string,@Body() body:UpdateMaterialDto,@Headers('authorization') h:string){return this.app.updateMaterial(id,body,this.app.requireUser(h))}
 @Delete(':id') @ApiBearerAuth() @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id:string,@Headers('authorization') h:string){this.app.removeMaterial(id,this.app.requireUser(h))}
 @Post(':id/comments') @ApiBearerAuth() comment(@Param('id') id:string,@Body() body:any,@Headers('authorization') h:string){return this.app.addComment(id,body,this.app.requireUser(h))}
 @Post(':id/ratings') @ApiBearerAuth() rating(@Param('id') id:string,@Body() body:any,@Headers('authorization') h:string){return this.app.addRating(id,body,this.app.requireUser(h))}
}
