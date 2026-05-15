// backend/src/database/seeds/category.seed.ts
import { DataSource } from 'typeorm';
import { Category } from '../entities/category/category.entity';

export async function seedCategories(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);

  const categories = [
    {
      categoryName: 'Categoria A - Executiva',
      baseSalaryMin: 500000,
      baseSalaryMax: 1000000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria B - Sênior',
      baseSalaryMin: 300000,
      baseSalaryMax: 600000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria C - Pleno',
      baseSalaryMin: 150000,
      baseSalaryMax: 350000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria D - Júnior',
      baseSalaryMin: 80000,
      baseSalaryMax: 180000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria E - Estagiário',
      baseSalaryMin: 35000,
      baseSalaryMax: 70000,
      isTributavel: false,
    },
    {
      categoryName: 'Categoria F - Aprendiz',
      baseSalaryMin: 25000,
      baseSalaryMax: 50000,
      isTributavel: false,
    },
    {
      categoryName: 'Categoria G - Consultor',
      baseSalaryMin: 400000,
      baseSalaryMax: 800000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria H - Gerência',
      baseSalaryMin: 600000,
      baseSalaryMax: 1200000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria I - Diretoria',
      baseSalaryMin: 1000000,
      baseSalaryMax: 2000000,
      isTributavel: true,
    },
    {
      categoryName: 'Categoria J - Operacional',
      baseSalaryMin: 50000,
      baseSalaryMax: 120000,
      isTributavel: true,
    },
  ];

  const savedCategories = [];

  for (const categoryData of categories) {
    let existingCategory = await categoryRepository.findOne({
      where: { categoryName: categoryData.categoryName },
    });

    if (!existingCategory) {
      existingCategory = categoryRepository.create(categoryData);
      existingCategory = await categoryRepository.save(existingCategory);
      console.log(
        `✅ Categoria criada: ${existingCategory.categoryName} (${existingCategory.baseSalaryMin} - ${existingCategory.baseSalaryMax} KZ)`,
      );
    } else {
      console.log(`ℹ️ Categoria já existe: ${existingCategory.categoryName}`);
    }

    savedCategories.push(existingCategory);
  }

  console.log(`✅ Total de ${savedCategories.length} categorias carregadas!`);
  return savedCategories;
}
