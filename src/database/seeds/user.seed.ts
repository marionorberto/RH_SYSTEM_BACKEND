// backend/src/database/seeds/user.seed.ts
import { DataSource } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { Role } from '../entities/role/role.entity';
import { UserRole } from '../entities/user-role/user-role.entity';
// import * as bcrypt from 'bcryptjs';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const userRoleRepository = dataSource.getRepository(UserRole);

  // 1. Criar roles primeiro
  const roles = [
    { roleName: 'admin', descriptionRole: 'Administrador do sistema' },
    { roleName: 'rh', descriptionRole: 'Recursos Humanos' },
    { roleName: 'funcionario', descriptionRole: 'Funcionário comum' },
  ];

  const savedRoles = [];
  for (const roleData of roles) {
    let role = await roleRepository.findOne({
      where: { roleName: roleData.roleName },
    });
    if (!role) {
      role = roleRepository.create(roleData);
      role = await roleRepository.save(role);
    }
    savedRoles.push(role);
  }

  // 2. Criar usuários
  const users = [
    {
      firstname: 'Admin',
      lastname: 'Sistema',
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      isSuperAdmin: true,
      active: true,
      isEmailVerified: true,
      roleName: 'admin',
    },
    {
      firstname: 'Recursos',
      lastname: 'Humanos',
      username: 'rh_user',
      email: 'rh@example.com',
      password: 'Rh@123',
      isSuperAdmin: false,
      active: true,
      isEmailVerified: true,
      roleName: 'rh',
    },
    {
      firstname: 'João',
      lastname: 'Silva',
      username: 'funcionario',
      email: 'funcionario@example.com',
      password: 'Func@123',
      isSuperAdmin: false,
      active: true,
      isEmailVerified: true,
      roleName: 'funcionario',
    },
  ];

  const savedUsers = [];
  for (const userData of users) {
    let user = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!user) {
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(userData.password, salt);

      user = userRepository.create({
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        isSuperAdmin: userData.isSuperAdmin,
        active: userData.active,
        isEmailVerified: userData.isEmailVerified,
      });
      user = await userRepository.save(user);
    }
    savedUsers.push({ user, roleName: userData.roleName });
  }

  // 3. Associar roles aos usuários
  for (const { user, roleName } of savedUsers) {
    const role = savedRoles.find((r) => r.roleName === roleName);
    if (role) {
      const existingUserRole = await userRoleRepository.findOne({
        where: { user: { id: user.id }, role: { id: role.id } },
      });

      if (!existingUserRole) {
        const userRole = userRoleRepository.create({
          user: user,
          role: role,
        });
        await userRoleRepository.save(userRole);
      }
    }
  }

  // console.log('✅ Seeds completed!');
  // console.log('👤 Admin user:', { email: 'admin@example.com', password: 'Admin@123' });
  // console.log('👤 RH user:', { email: 'rh@example.com', password: 'Rh@123' });
  // console.log('👤 Funcionario user:', { email: 'funcionario@example.com', password: 'Func@123' });
}
