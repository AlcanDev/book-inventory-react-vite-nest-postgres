import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  author!: string;

  @ApiProperty({ description: 'Editorial' })
  @IsString()
  publisher!: string;

  @ApiProperty({ description: 'Precio en formato decimal ej: 12990.00' })
  @IsNumberString()
  price!: string;

  @ApiProperty()
  @IsBoolean()
  available!: boolean;

  @ApiProperty()
  @IsString()
  genre!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
