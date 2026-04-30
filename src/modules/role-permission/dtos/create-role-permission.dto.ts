// backend/src/modules/role-permission/dtos/create-role-permission.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @IsUUID(4, { message: 'ID do role inválido' })
  @IsNotEmpty({ message: 'O ID do role não pode estar vazio' })
  roleId: string;

  @IsUUID(4, { message: 'ID da permissão inválido' })
  @IsNotEmpty({ message: 'O ID da permissão não pode estar vazio' })
  permissionId: string;
}
