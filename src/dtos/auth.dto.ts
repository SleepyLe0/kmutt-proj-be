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
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}