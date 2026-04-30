// backend/src/database/seeds/role-permission.seed.ts
import { DataSource } from 'typeorm';
import { Role } from '../entities/role/role.entity';
import { Permission } from '../entities/permission/permission.entity';
import { RolePermission } from '../entities/permission-role/permission-role.entity';

export async function seedRolePermissions(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const rolePermissionRepository = dataSource.getRepository(RolePermission);

  // Buscar roles
  const adminRole = await roleRepository.findOne({
    where: { roleName: 'admin' },
  });
  const rhRole = await roleRepository.findOne({ where: { roleName: 'rh' } });
  const funcionarioRole = await roleRepository.findOne({
    where: { roleName: 'funcionario' },
  });

  if (!adminRole || !rhRole || !funcionarioRole) {
    console.log('❌ Roles não encontradas. Execute seedUsers primeiro.');
    return;
  }

  // Buscar todas as permissões
  const allPermissions = await permissionRepository.find();

  // Separar permissões por categoria
  const userPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('user.'),
  );
  const employeePermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('employee.'),
  );
  const departamentPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('departament.'),
  );
  const functionPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('function.'),
  );
  const remunerationPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('remuneration.'),
  );
  const discountPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('discount.'),
  );
  const payrollPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('payroll.'),
  );
  const settingsPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('settings.'),
  );
  const reportPermissions = allPermissions.filter((p) =>
    p.nomePermission.startsWith('report.'),
  );
  const employeeSelfPermissions = allPermissions.filter(
    (p) =>
      p.nomePermission.startsWith('employee.self.') ||
      p.nomePermission.startsWith('documents.self.') ||
      p.nomePermission.startsWith('requests.'),
  );

  // Definir permissões por role
  const rolePermissionsMap = {
    [adminRole.id]: {
      role: adminRole,
      permissions: allPermissions, // Admin tem todas as permissões
    },
    [rhRole.id]: {
      role: rhRole,
      permissions: [
        ...userPermissions.filter((p) => p.nomePermission !== 'user.delete'), // RH não pode deletar usuári
        // os
        ...employeePermissions,
        ...departamentPermissions,
        ...functionPermissions,
        ...remunerationPermissions,
        ...discountPermissions,
        ...payrollPermissions,
        ...settingsPermissions.filter(
          (p) => p.nomePermission === 'settings.company',
        ), // RH só pode configurar empre
        // sa
        ...reportPermissions,
      ],
    },
    [funcionarioRole.id]: {
      role: funcionarioRole,
      permissions: employeeSelfPermissions, // Funcionário só vê o próprio
    },
  };

  // Criar associações
  let totalCreated = 0;

  for (const roleId of Object.keys(rolePermissionsMap)) {
    const { role, permissions } = rolePermissionsMap[roleId];

    for (const permission of permissions) {
      const existing = await rolePermissionRepository.findOne({
        where: {
          role: { id: role.id },
          permission: { id: permission.id },
        },
      });

      if (!existing) {
        const rolePermission = rolePermissionRepository.create({
          role,
          permission,
        });
        await rolePermissionRepository.save(rolePermission);
        totalCreated++;
        console.log(
          `✅ Permissão "${permission.nomePermission}" associada ao role "${role.roleName}"`,
        );
      }
    }
  }

  console.log(
    `✅ Total de ${totalCreated} associações role-permissão criadas!`,
  );
}
