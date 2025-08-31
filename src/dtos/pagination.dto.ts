import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class paginationDto {
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsString()
  sort_option?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  search_option?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  date_start?: string;

  @IsOptional()
  @IsString()
  date_end?: string;

  @IsOptional()
  @IsString()
  filter_type?: string;
}
