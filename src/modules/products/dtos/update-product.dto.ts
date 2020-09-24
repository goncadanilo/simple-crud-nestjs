import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  price?: number;
}
