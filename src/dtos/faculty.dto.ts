import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateFacultyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
