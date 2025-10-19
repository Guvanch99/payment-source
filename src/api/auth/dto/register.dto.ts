import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    example: 'John@mai.ru',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public password: string;
}
