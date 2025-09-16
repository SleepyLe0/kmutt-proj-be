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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IntakeDegreeDto)
  master: IntakeDegreeDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IntakeDegreeDto)
  doctoral: IntakeDegreeDto;
}

export class IntakeRoundDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  no: number;

  @IsNotEmpty()
  @IsString()
  interview_date: string;
}

export class IntakeMonthlyDto {
  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsString()
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
}

export class SubmitterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

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
  user_id: string;
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
  user_id?: string;
  @IsOptional()
  @IsMongoId()
  admission_id?: string;

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
