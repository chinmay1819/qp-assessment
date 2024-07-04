import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  username: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  password: string;
}
