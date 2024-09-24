import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          phoneNumber: faker.phone.number(),
          name: faker.person.firstName(),
          surname: faker.person.lastName(),
          birthday: faker.date.past().toISOString().split('T')[0],
          verificationCode: faker.string.numeric(6),
          password: faker.internet.password(),
          isVerified: faker.datatype.boolean(),
          role: faker.helpers.arrayElement([Role.USER, Role.ADMIN]),
        },
      })
    )
  );

  // Create Brends
  const brends = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const brend = await prisma.brend.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          logo: faker.image.url(),
          brendName: faker.company.name(),
          ownerNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          password: faker.internet.password(),
          isTopBrend: faker.datatype.boolean(),
        },
      });

      // Create TopBrend for some Brends
      if (brend.isTopBrend) {
        await prisma.topBrend.create({
          data: {
            userId: brend.userId,
            brendId: brend.id,
          },
        });
      }

      return brend;
    })
  );

  // Create Cars
  const cars = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.car.create({
        data: {
          brendId: faker.helpers.arrayElement(brends).id,
          title: faker.vehicle.model(),
          price: faker.commerce.price(),
          color: faker.vehicle.color(),
          fuelType: faker.vehicle.fuel(),
          carType: faker.vehicle.type(),
          numberOfSeats: faker.number.int({ min: 2, max: 8 }),
          features: faker.helpers.arrayElements(['GPS', 'Bluetooth', 'Leather seats', 'Sunroof'], { min: 1, max: 4 }),
          requirements: faker.helpers.arrayElements(['Valid license', 'Credit card', 'Insurance'], { min: 1, max: 3 }),
          isAvailable: faker.datatype.boolean(),
          images: Array.from({ length: 3 }, () => faker.image.url()),
        },
      })
    )
  );

  // Create Rentals
  await Promise.all(
    Array.from({ length: 30 }).map(() =>
      prisma.rental.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          carId: faker.helpers.arrayElement(cars).id,
          rentalStart: faker.date.future(),
          rentalEnd: faker.date.future(),
          pickupTime: faker.date.future().toTimeString().split(' ')[0],
          returnTime: faker.date.future().toTimeString().split(' ')[0],
          requiresDriver: faker.datatype.boolean(),
          requiresDelivery: faker.datatype.boolean(),
          travelRegion: faker.location.state(),
          estimatedDistance: faker.number.int({ min: 50, max: 1000 }).toString(),
          username: faker.person.firstName(),
          surname: faker.person.lastName(),
          usersFatherName: faker.person.firstName(),
          driverLicence: faker.string.alphanumeric(10),
          passport: faker.string.alphanumeric(9),
          address: faker.location.streetAddress(),
          passportImages: Array.from({ length: 2 }, () => faker.image.url()),
          driverLicenceImages: Array.from({ length: 2 }, () => faker.image.url()),
          isActive: faker.datatype.boolean(),
        },
      })
    )
  );

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });