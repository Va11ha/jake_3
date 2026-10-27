import { IsIn, IsOptional, IsString, MaxLength, MinLength, IsUrl } from 'class-validator';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateMaterialDto {
 @ApiProperty() @IsString() @MinLength(2) @MaxLength(220) title!:string;
 @ApiProperty() @IsString() @MinLength(1) @MaxLength(2000) description!:string;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20000) content?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() category_id?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() course_id?:string;
 @ApiPropertyOptional({enum:['public','registered','course']}) @IsOptional() @IsIn(['public','registered','course']) access_level?:string;
 @ApiPropertyOptional() @IsOptional() @IsString() external_url?:string;
}
export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {}
