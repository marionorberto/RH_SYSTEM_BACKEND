// backend/src/database/seeds/irt.seed.ts
import { DataSource } from 'typeorm';
import { Irt } from '../entities/irt/irt.entity';

export async function seedIrt(dataSource: DataSource) {
  const irtRepository = dataSource.getRepository(Irt);

  // Tabela de IRT para Angola (exemplo)
  const irtBrackets = [
    { inferiorLimit: 0, superiorLimit: 70000, tax: 0, FixedValue: 0 },
    { inferiorLimit: 70001, superiorLimit: 100000, tax: 10, FixedValue: 0 },
    { inferiorLimit: 100001, superiorLimit: 200000, tax: 15, FixedValue: 3000 },
    {
      inferiorLimit: 200001,
      superiorLimit: 500000,
      tax: 25,
      FixedValue: 18000,
    },
    { inferiorLimit: 500001, superiorLimit: null, tax: 35, FixedValue: 93000 },
  ];

  const savedIrt = [];

  for (const irtData of irtBrackets) {
    const existingIrt = await irtRepository.findOne({
      where: {
        inferiorLimit: irtData.inferiorLimit,
        superiorLimit: irtData.superiorLimit,
      },
    });

    if (!existingIrt) {
      const newIrt = irtRepository.create(irtData);
      const saved = await irtRepository.save(newIrt);
      console.log(
        `✅ Faixa de IRT criada: ${saved.inferiorLimit} - ${saved.superiorLimit || '∞'}`,
      );
      savedIrt.push(saved);
    } else {
      console.log(`ℹ️ Faixa de IRT já existe`);
      savedIrt.push(existingIrt);
    }
  }

  console.log(`✅ Total de ${savedIrt.length} faixas de IRT carregadas!`);
  return savedIrt;
}
