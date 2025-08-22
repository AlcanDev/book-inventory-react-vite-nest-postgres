import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryBookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Editorial' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'true | false' })
  @IsOptional()
  @IsBooleanString()
  available?: string;

  @ApiPropertyOptional({ description: 'page >= 1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'limit <= 100' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ description: 'Ej: price:asc,title:desc' })
  @IsOptional()
  @IsString()
  sort?: string;
}
