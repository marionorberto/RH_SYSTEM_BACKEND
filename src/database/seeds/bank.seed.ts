// backend/src/database/seeds/bank.seed.ts
import { DataSource } from 'typeorm';
import { Bank } from '../entities/bank/bank.entity';

export async function seedBanks(dataSource: DataSource) {
  const bankRepository = dataSource.getRepository(Bank);

  const banks = [
    { bank_name: 'Banco Angolano de Investimentos', sigla: 'BAI', code: '004' },
    { bank_name: 'Banco de Poupança e Crédito', sigla: 'BPC', code: '006' },
    { bank_name: 'Banco Nacional de Angola', sigla: 'BNA', code: '001' },
    { bank_name: 'Banco Económico', sigla: 'BE', code: '003' },
    { bank_name: 'Banco Millennium Atlântico', sigla: 'BMA', code: '005' },
    {
      bank_name: 'Banco de Desenvolvimento de Angola',
      sigla: 'BDA',
      code: '007',
    },
    { bank_name: 'Banco Sol', sigla: 'BSOL', code: '008' },
    { bank_name: 'Banco Keve', sigla: 'BKEVE', code: '009' },
  ];

  const savedBanks = [];

  for (const bankData of banks) {
    let existingBank = await bankRepository.findOne({
      where: { code: bankData.code },
    });

    if (!existingBank) {
      existingBank = bankRepository.create(bankData);
      existingBank = await bankRepository.save(existingBank);
      console.log(
        `✅ Banco criado: ${existingBank.bank_name} (${existingBank.sigla})`,
      );
    } else {
      console.log(`ℹ️ Banco já existe: ${existingBank.bank_name}`);
    }

    savedBanks.push(existingBank);
  }

  console.log(`✅ Total de ${savedBanks.length} bancos carregados!`);
  return savedBanks;
}
