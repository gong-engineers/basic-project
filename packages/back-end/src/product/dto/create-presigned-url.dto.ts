import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileType: string;
}
