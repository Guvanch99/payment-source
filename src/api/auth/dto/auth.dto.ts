import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'asdas....',
    description: 'Access token used for authorization',
  })
  public accessToken: string;
}
