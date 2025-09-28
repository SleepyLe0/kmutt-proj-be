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

  // Form-specific filters
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  admission_id?: string;

  @IsOptional()
  @IsString()
  faculty?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  submitter_name?: string;

  @IsOptional()
  @IsString()
  submitter_email?: string;
}
