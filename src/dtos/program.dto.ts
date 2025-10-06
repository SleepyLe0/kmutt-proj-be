import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsIn,
} from 'class-validator';

export class CreateProgramDto {
  @IsNotEmpty()
  @IsMongoId()
  faculty_id: string;

  @IsOptional()
  @IsMongoId()
  department_id?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsIn(['master', 'doctoral'])
  degree_level: 'master' | 'doctoral';

  @IsNotEmpty()
  @IsString()
  degree_abbr: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsIn(['bachelor', 'master'])
  degree_req?: 'bachelor' | 'master';
}

export class UpdateProgramDto {
  @IsOptional()
  @IsMongoId()
  faculty_id?: string;

  @IsOptional()
  @IsMongoId()
  department_id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(['master', 'doctoral'])
  degree_level?: 'master' | 'doctoral';

  @IsOptional()
  @IsString()
  degree_abbr?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
