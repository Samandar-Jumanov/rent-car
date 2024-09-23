import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Fixed userId for all entries
const FIXED_USER_ID = 'cm1f4w18a00007sarbdspu531';

async function main() {
  // Create fake Brends first (including top brends)
  const brends = await Promise.all(
    Array.from({ length: 15 }).map(async (_, index) => {
      return prisma.brend.create({
        data: {
          userId: FIXED_USER_ID,
          logo: faker.image.url(),
          brendName: faker.company.name(),
          ownerNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          password: faker.internet.password(),
          isTopBrend: index < 5, // First 5 will be top brends
        },
      });
    })
  );

  // Create TopBrends for the first 5 Brends
  await Promise.all(
    brends.slice(0, 5).map(async (brend) => {
      return prisma.topBrend.create({
        data: {
          userId: FIXED_USER_ID,
          brendId: brend.id,
        },
      });
    })
  );

  // Create fake Cars
  const cars = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const brend = faker.helpers.arrayElement(brends);
      return prisma.car.create({
        data: {
          brendId: brend.id,
          title: faker.vehicle.model(),
          price: faker.commerce.price(),
          color: faker.vehicle.color(),
          fuelType: faker.helpers.arrayElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
          carType: faker.vehicle.type(),
          numberOfSeats: faker.number.int({ min: 2, max: 8 }),
          features: faker.helpers.arrayElements(['GPS', 'Bluetooth', 'Leather seats', 'Sunroof', 'Backup camera'], { min: 1, max: 5 }),
          requirements: faker.helpers.arrayElements(['Valid license', '21+ years old', 'Credit card required'], { min: 1, max: 3 }),
          isAvailable: faker.datatype.boolean(),
        },
      });
    })
  );

  // Create fake Images for Cars
  await Promise.all(
    cars.flatMap(car => 
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() =>
        prisma.image.create({
          data: {
            carId: car.id,
            url: faker.image.url(),
          },
        })
      )
    )
  );
  console.log('Fake data generation completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });