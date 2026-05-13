import { UserRoles } from '../enum/user-role.enum';

export interface JwtPayload {
  id: string;
  role?: UserRoles;
}
