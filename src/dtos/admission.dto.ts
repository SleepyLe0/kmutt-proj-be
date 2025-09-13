import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TermDto {
  @IsNotEmpty()
  @IsNumber()
  semester: number;

  @IsNotEmpty()
  @IsNumber()
  academic_year_th: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsNumber()
  sort_key?: number;
}

export class ApplicationWindowDto {
  @IsNotEmpty()
  @IsDateString()
  open_at: string;

  @IsNotEmpty()
  @IsDateString()
  close_at: string;

  @IsOptional()
  @IsString()
  notice?: string;

  @IsOptional()
  @IsString()
  calendar_url?: string;
}

export class RoundDto {
  @IsNotEmpty()
  @IsNumber()
  no: number;

  @IsNotEmpty()
  @IsDateString()
  interview_date: string;
}

export class MonthlyDto {
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsDateString()
  interview_date: string;
}

export class CreateAdmissionDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TermDto)
  term: TermDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ApplicationWindowDto)
  application_window: ApplicationWindowDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoundDto)
  rounds: RoundDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyDto)
  monthly: MonthlyDto[];
}

export class UpdateAdmissionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationWindowDto)
  application_window?: ApplicationWindowDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoundDto)
  rounds?: RoundDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyDto)
  monthly?: MonthlyDto[];
}
