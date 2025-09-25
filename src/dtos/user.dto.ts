import { IsIn, IsNotEmpty } from "class-validator";

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role: 'admin' | 'user';
}