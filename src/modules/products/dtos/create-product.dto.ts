import {
  IsDecimal,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}
