import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Type(() => String)
  password: string;
}
