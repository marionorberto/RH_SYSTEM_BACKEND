// backend/src/database/seeds/departament.seed.ts
import { DataSource } from 'typeorm';
import { Departament } from '../entities/departament/departament.entity';

export async function seedDepartaments(dataSource: DataSource) {
  const departamentRepository = dataSource.getRepository(Departament);

  const departaments = [
    { departamentName: 'Tecnologia da Informação (TI)' },
    { departamentName: 'Recursos Humanos (RH)' },
    { departamentName: 'Financeiro' },
    { departamentName: 'Administrativo' },
    { departamentName: 'Comercial / Vendas' },
    { departamentName: 'Marketing' },
    { departamentName: 'Operações' },
    { departamentName: 'Jurídico' },
    { departamentName: 'Logística' },
    { departamentName: 'Atendimento ao Cliente' },
  ];

  const savedDepartaments = [];

  for (const departamentData of departaments) {
    let existingDepartament = await departamentRepository.findOne({
      where: { departamentName: departamentData.departamentName },
    });

    if (!existingDepartament) {
      existingDepartament = departamentRepository.create(departamentData);
      existingDepartament =
        await departamentRepository.save(existingDepartament);
      console.log(
        `✅ Departamento criado: ${existingDepartament.departamentName}`,
      );
    } else {
      console.log(
        `ℹ️ Departamento já existe: ${existingDepartament.departamentName}`,
      );
    }

    savedDepartaments.push(existingDepartament);
  }

  console.log(
    `✅ Total de ${savedDepartaments.length} departamentos carregados!`,
  );
  return savedDepartaments;
}
