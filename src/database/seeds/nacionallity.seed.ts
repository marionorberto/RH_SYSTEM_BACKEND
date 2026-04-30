// backend/src/database/seeds/nacionality.seed.ts
import { DataSource } from 'typeorm';
import { Nacionality } from '../entities/nacionality/nacionality.entity';

export async function seedNacionalities(dataSource: DataSource) {
  const nacionalityRepository = dataSource.getRepository(Nacionality);

  const nacionalities = [
    { isocode: 'AO', nomeNacionalidade: 'Angolana' },
    { isocode: 'PT', nomeNacionalidade: 'Portuguesa' },
    { isocode: 'BR', nomeNacionalidade: 'Brasileira' },
    { isocode: 'CV', nomeNacionalidade: 'Cabo-verdiana' },
    { isocode: 'ST', nomeNacionalidade: 'Santomense' },
    { isocode: 'GW', nomeNacionalidade: 'Guinéu' },
    { isocode: 'MZ', nomeNacionalidade: 'Moçambicana' },
    { isocode: 'AO', nomeNacionalidade: 'Angolana' }, // Duplicado proposital para teste
  ];

  // Remover duplicados
  const uniqueNacionalities = Array.from(
    new Map(
      nacionalities.map((item) => [item.nomeNacionalidade, item]),
    ).values(),
  );

  const savedNacionalities = [];

  for (const nacionalityData of uniqueNacionalities) {
    let existingNacionality = await nacionalityRepository.findOne({
      where: {
        nomeNacionalidade: nacionalityData.nomeNacionalidade,
      },
    });

    if (!existingNacionality) {
      existingNacionality = await nacionalityRepository.findOne({
        where: { isocode: nacionalityData.isocode },
      });
    }

    if (!existingNacionality) {
      existingNacionality = nacionalityRepository.create(nacionalityData);
      existingNacionality =
        await nacionalityRepository.save(existingNacionality);
      console.log(
        `✅ Nacionalidade criada: ${existingNacionality.nomeNacionalidade} (${existingNacionality.isocode})`,
      );
    } else {
      console.log(
        `ℹ️ Nacionalidade já existe: ${existingNacionality.nomeNacionalidade} (${existingNacionality.isocode})`,
      );
    }

    savedNacionalities.push(existingNacionality);
  }

  console.log(
    `✅ Total de ${savedNacionalities.length} nacionalidades carregadas!`,
  );
  return savedNacionalities;
}
