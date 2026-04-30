// backend/src/database/seeds/fiscal-year.seed.ts
import { DataSource } from 'typeorm';
import { FiscalYear } from '../entities/fiscal-year/fiscal-year.entity';

export async function seedFiscalYears(dataSource: DataSource) {
  const fiscalYearRepository = dataSource.getRepository(FiscalYear);

  const currentYear = new Date().getFullYear();
  const fiscalYears = [
    { year: (currentYear - 1).toString() },
    { year: currentYear.toString() },
    { year: (currentYear + 1).toString() },
    { year: `${currentYear - 1}/${currentYear}` },
    { year: `${currentYear}/${currentYear + 1}` },
  ];

  const savedFiscalYears = [];

  for (const fyData of fiscalYears) {
    let existingFy = await fiscalYearRepository.findOne({
      where: { year: fyData.year },
    });

    if (!existingFy) {
      existingFy = fiscalYearRepository.create(fyData);
      existingFy = await fiscalYearRepository.save(existingFy);
      console.log(`✅ Ano fiscal criado: ${existingFy.year}`);
    } else {
      console.log(`ℹ️ Ano fiscal já existe: ${existingFy.year}`);
    }

    savedFiscalYears.push(existingFy);
  }

  console.log(
    `✅ Total de ${savedFiscalYears.length} anos fiscais carregados!`,
  );
  return savedFiscalYears;
}
