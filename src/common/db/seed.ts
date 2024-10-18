import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function generateFakeDiscount(existingBrandId: string | null = null) {
  const brands = await prisma.brand.findMany({ select: { id: true }, take: 2 });
  let brandId = null;

  if (brands.length > 0) {
    if (existingBrandId) {
      brandId = brands.find(b => b.id !== existingBrandId)?.id || null;
    } else {
      brandId = brands[0].id;
    }
  }

  const car = await prisma.car.findFirst({ select: { id: true } });

  return {
    carId: car?.id || null,
    brendId: brandId,
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    discountPercentage: faker.number.int({ min: 5, max: 50 }),
    discountId: faker.string.alphanumeric(10),
  };
}

async function seedDiscounts() {
  console.log('Seeding 2 discounts...');

  let firstDiscount = null;
  try {
    firstDiscount = await generateFakeDiscount();
    await prisma.discount.create({
      data: firstDiscount,
    });
    console.log('First discount created');
  } catch (error) {
    console.error('Error creating first discount:', error);
  }

  try {
    const secondDiscount = await generateFakeDiscount(firstDiscount?.brendId);
    await prisma.discount.create({
      data: secondDiscount,
    });
    console.log('Second discount created');
  } catch (error) {
    console.error('Error creating second discount:', error);
  }

  console.log('Seeding completed.');
}

async function main() {
  try {
    await seedDiscounts();
  } catch (error) {
    console.error('Error seeding discounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});