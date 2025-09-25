import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class GoogleAuthRequest {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class GoogleProfile {
  google_id: string;
  email: string;
  name: string;
  picture?: string;
}