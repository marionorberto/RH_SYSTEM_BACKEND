// backend/src/modules/role-permission/dtos/assign-permissions.dto.ts
import { IsArray, IsUUID, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class AssignPermissionsDto {
  @IsUUID(4, { message: 'ID do role inválido' })
  @IsNotEmpty({ message: 'O ID do role não pode estar vazio' })
  roleId: string;

  @IsArray({ message: 'Permissions deve ser um array' })
  @ArrayMinSize(1, { message: 'Deve ser fornecida pelo menos uma permissão' })
  @IsUUID(4, {
    each: true,
    message: 'Um ou mais IDs de permissão são inválidos',
  })
  permissionIds: string[];
}
