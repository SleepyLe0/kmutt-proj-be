import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LabelOnWebThDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;
}

export class ContentDto {
  @IsNotEmpty()
  @IsNumber()
  no: number;

  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LabelOnWebThDto)
  label_on_web_th: LabelOnWebThDto;

  @IsNotEmpty()
  @IsString()
  label_on_web_en: string;

  @IsNotEmpty()
  @IsString()
  application_form_status: string;

  @IsNotEmpty()
  @IsString()
  start_date: string;

  @IsNotEmpty()
  @IsString()
  end_date: string;

  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  current_stage: 'Yes' | 'No';

  @IsNotEmpty()
  @IsBoolean()
  export: boolean;
}

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents: ContentDto[];
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents?: ContentDto[];
}
