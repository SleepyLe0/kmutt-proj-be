import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsMongoId()
  faculty_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsMongoId()
  faculty_id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
