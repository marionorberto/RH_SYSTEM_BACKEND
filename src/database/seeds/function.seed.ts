// backend/src/database/seeds/function.seed.ts
import { DataSource } from 'typeorm';
import { Function } from '../entities/function/function.entity';

export async function seedFunctions(dataSource: DataSource) {
  const functionRepository = dataSource.getRepository(Function);

  const functions = [
    { functionName: 'Desenvolvedor Senior' },
    { functionName: 'Analista de RH' },
    { functionName: 'Coordenador de Projetos' },
    { functionName: 'Analista Financeiro' },
    { functionName: 'Assistente Administrativo' },
    { functionName: 'Gerente de Departamento' },
    { functionName: 'Estagiário' },
    { functionName: 'Consultor' },
  ];

  const savedFunctions = [];

  for (const functionData of functions) {
    let existingFunction = await functionRepository.findOne({
      where: { functionName: functionData.functionName },
    });

    if (!existingFunction) {
      existingFunction = functionRepository.create(functionData);
      existingFunction = await functionRepository.save(existingFunction);
      console.log(`✅ Função criada: ${existingFunction.functionName}`);
    } else {
      console.log(`ℹ️ Função já existe: ${existingFunction.functionName}`);
    }

    savedFunctions.push(existingFunction);
  }

  console.log(`✅ Total de ${savedFunctions.length} funções carregadas!`);
  return savedFunctions;
}
