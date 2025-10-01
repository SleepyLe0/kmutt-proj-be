import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  IsMongoId,
  IsIn,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IntakeDegreeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsBoolean()
  bachelor_req?: boolean;

  @IsOptional()
  @IsBoolean()
  master_req?: boolean;
}

export class IntakeDegreeStructureDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => IntakeDegreeDto)
  master?: IntakeDegreeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => IntakeDegreeDto)
  doctoral?: IntakeDegreeDto;
}

export class IntakeRoundDto {
  @IsNotEmpty()
  @IsNumber()
  no: number;

  @IsNotEmpty()
  @IsString() 
  title: string;

  @IsNotEmpty()
  @IsDateString()
  interview_date: string;
}

export class IntakeMonthlyDto {
  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  interview_date: string;
}

export class IntakeCalendarDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntakeRoundDto)
  rounds: IntakeRoundDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntakeMonthlyDto)
  monthly: IntakeMonthlyDto[];

  @IsOptional()
  @IsString()
  message?: string;
}

export class SubmitterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  phone: string[];

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class IntakeProgramDto {
  @IsNotEmpty()
  @IsMongoId()
  program_id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IntakeDegreeStructureDto)
  intake_degree: IntakeDegreeStructureDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IntakeCalendarDto)
  intake_calendar: IntakeCalendarDto;
}

export class CreateFormDto {
  @IsNotEmpty()
  @IsMongoId()
  admission_id: string;

  @IsNotEmpty()
  @IsMongoId()
  faculty_id: string;

  @IsNotEmpty()
  @IsMongoId()
  department_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntakeProgramDto)
  intake_programs: IntakeProgramDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubmitterDto)
  submitter: SubmitterDto;

  @IsOptional()
  @IsIn(['received', 'verified'])
  status?: 'received' | 'verified';
}

export class UpdateFormDto {
  @IsOptional()
  @IsMongoId()
  faculty_id?: string;

  @IsOptional()
  @IsMongoId()
  department_id?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntakeProgramDto)
  intake_programs?: IntakeProgramDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SubmitterDto)
  submitter?: SubmitterDto;

  @IsOptional()
  @IsIn(['received', 'verified'])
  status?: 'received' | 'verified';
}
