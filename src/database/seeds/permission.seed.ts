// backend/src/database/seeds/permission.seed.ts
import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission/permission.entity';

export async function seedPermissions(dataSource: DataSource) {
  const permissionRepository = dataSource.getRepository(Permission);

  const permissions = [
    // Permissões de Usuários
    {
      nomePermission: 'user.create',
      descricaoPermission: 'Criar novos usuários',
    },
    {
      nomePermission: 'user.read',
      descricaoPermission: 'Visualizar usuários',
    },
    {
      nomePermission: 'user.update',
      descricaoPermission: 'Atualizar usuários',
    },
    {
      nomePermission: 'user.delete',
      descricaoPermission: 'Deletar usuários',
    },
    {
      nomePermission: 'user.manage',
      descricaoPermission: 'Gerenciar todos os aspectos de usuários',
    },

    // Permissões de Funcionários
    {
      nomePermission: 'employee.create',
      descricaoPermission: 'Criar funcionários',
    },
    {
      nomePermission: 'employee.read',
      descricaoPermission: 'Visualizar funcionários',
    },
    {
      nomePermission: 'employee.update',
      descricaoPermission: 'Atualizar funcionários',
    },
    {
      nomePermission: 'employee.delete',
      descricaoPermission: 'Deletar funcionários',
    },
    {
      nomePermission: 'employee.manage',
      descricaoPermission: 'Gerenciar todos os aspectos de funcionários',
    },

    // Permissões de Departamentos
    {
      nomePermission: 'departament.create',
      descricaoPermission: 'Criar departamentos',
    },
    {
      nomePermission: 'departament.read',
      descricaoPermission: 'Visualizar departamentos',
    },
    {
      nomePermission: 'departament.update',
      descricaoPermission: 'Atualizar departamentos',
    },
    {
      nomePermission: 'departament.delete',
      descricaoPermission: 'Deletar departamentos',
    },

    // Permissões de Funções
    {
      nomePermission: 'function.create',
      descricaoPermission: 'Criar funções',
    },
    {
      nomePermission: 'function.read',
      descricaoPermission: 'Visualizar funções',
    },
    {
      nomePermission: 'function.update',
      descricaoPermission: 'Atualizar funções',
    },
    {
      nomePermission: 'function.delete',
      descricaoPermission: 'Deletar funções',
    },

    // Permissões de Remunerações
    {
      nomePermission: 'remuneration.create',
      descricaoPermission: 'Criar remunerações',
    },
    {
      nomePermission: 'remuneration.read',
      descricaoPermission: 'Visualizar remunerações',
    },
    {
      nomePermission: 'remuneration.update',
      descricaoPermission: 'Atualizar remunerações',
    },
    {
      nomePermission: 'remuneration.delete',
      descricaoPermission: 'Deletar remunerações',
    },

    // Permissões de Descontos
    {
      nomePermission: 'discount.create',
      descricaoPermission: 'Criar descontos',
    },
    {
      nomePermission: 'discount.read',
      descricaoPermission: 'Visualizar descontos',
    },
    {
      nomePermission: 'discount.update',
      descricaoPermission: 'Atualizar descontos',
    },
    {
      nomePermission: 'discount.delete',
      descricaoPermission: 'Deletar descontos',
    },

    // Permissões de Processamento Salarial
    {
      nomePermission: 'payroll.process',
      descricaoPermission: 'Processar folha de pagamento',
    },
    {
      nomePermission: 'payroll.read',
      descricaoPermission: 'Visualizar processamentos',
    },
    {
      nomePermission: 'payroll.export',
      descricaoPermission: 'Exportar folhas de pagamento',
    },

    // Permissões de Configurações
    {
      nomePermission: 'settings.company',
      descricaoPermission: 'Configurar dados da empresa',
    },
    {
      nomePermission: 'settings.system',
      descricaoPermission: 'Configurações do sistema',
    },
    {
      nomePermission: 'settings.roles',
      descricaoPermission: 'Gerenciar roles e permissões',
    },

    // Permissões de Relatórios
    {
      nomePermission: 'report.view',
      descricaoPermission: 'Visualizar relatórios',
    },
    {
      nomePermission: 'report.export',
      descricaoPermission: 'Exportar relatórios',
    },

    // Permissões do Funcionário (visão limitada)
    {
      nomePermission: 'employee.self.view',
      descricaoPermission: 'Visualizar próprio perfil',
    },
    {
      nomePermission: 'employee.self.update',
      descricaoPermission: 'Atualizar próprio perfil',
    },
    {
      nomePermission: 'documents.self.view',
      descricaoPermission: 'Visualizar próprios documentos',
    },
    {
      nomePermission: 'requests.create',
      descricaoPermission: 'Criar solicitações',
    },
    {
      nomePermission: 'requests.view',
      descricaoPermission: 'Visualizar próprias solicitações',
    },
  ];

  const savedPermissions = [];

  for (const permData of permissions) {
    let existingPerm = await permissionRepository.findOne({
      where: { nomePermission: permData.nomePermission },
    });

    if (!existingPerm) {
      existingPerm = permissionRepository.create(permData);
      existingPerm = await permissionRepository.save(existingPerm);
      console.log(`✅ Permissão criada: ${existingPerm.nomePermission}`);
    } else {
      console.log(`ℹ️ Permissão já existe: ${existingPerm.nomePermission}`);
    }

    savedPermissions.push(existingPerm);
  }

  console.log(`✅ Total de ${savedPermissions.length} permissões carregadas!`);
  return savedPermissions;
}
