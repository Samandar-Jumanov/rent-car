import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Generate fake users
  const users = await Promise.all(
    Array(10).fill(null).map(() => 
      prisma.user.create({
        data: {
          phoneNumber: faker.phone.number(),
          name: faker.person.firstName(),
          surname: faker.person.lastName(),
          birthday: faker.date.past().toISOString(),
          verificationCode: faker.string.numeric(6),
          password: faker.internet.password(),
          location: faker.location.city(),
          isVerified: faker.datatype.boolean(),
          role: faker.helpers.arrayElement(['USER', 'AGENT', 'SUPER_ADMIN']),
        }
      })
    )
  );

  // Generate fake brands
  const brands = await Promise.all(
    Array(5).fill(null).map(() => 
      prisma.brand.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          logo: faker.image.url(),
          brendName: faker.company.name(),
          ownerNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          password: faker.internet.password(),
          carDelivery: faker.helpers.arrayElement(['TAKE_AWAY', 'DELIVER']),
          payment: faker.helpers.arrayElement(['CARD', 'TERMINAL', 'CASH']),
        }
      })
    )
  );

  // Generate fake top brands
  const topBrandIds = brands.slice(0, 3).map(brand => brand.id);
  await Promise.all(
    topBrandIds.map(brendId => 
      prisma.topBrend.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          brendId: brendId,
        }
      })
    )
  );

  // Generate fake cars
  const cars = await Promise.all(
    Array(20).fill(null).map(() => 
      prisma.car.create({
        data: {
          brendId: faker.helpers.arrayElement(brands).id,
          title: faker.vehicle.model(),
          carBrend: faker.vehicle.manufacturer(),
          price: faker.number.float({ min: 50, max: 500 }),
          isDiscounted: faker.datatype.boolean(),
          discountedPrice: faker.number.float({ min: 40, max: 450 }).toString(),
          color: faker.color.human(),
          isAvailable: faker.datatype.boolean(),
          images: Array(3).fill(null).map(() => faker.image.url()),
          status: faker.helpers.arrayElement(['FREE', 'RENTED']),
        }
      })
    )
  );

  // Generate fake features
  const featureTitles = new Set();
  await Promise.all(
    Array(50).fill(null).map(() => {
      let title;
      do {
        title = faker.vehicle.type();
      } while (featureTitles.has(title));
      featureTitles.add(title);

      return prisma.feature.create({
        data: {
          carId: faker.helpers.arrayElement(cars).id,
          title: title,
          icon: faker.internet.url(),
        }
      });
    })
  );

  // Generate fake requirements
  await Promise.all(
    Array(30).fill(null).map(() => 
      prisma.requirements.create({
        data: {
          carId: faker.helpers.arrayElement(cars).id,
          title: faker.lorem.words(3),
          icon: faker.internet.url(),
          upFrontMoney: faker.finance.amount(),
        }
      })
    )
  );

  // Generate fake rentals
  await Promise.all(
    Array(15).fill(null).map(() => 
      prisma.rental.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          carId: faker.helpers.arrayElement(cars).id,
          rentalStart: faker.date.future().toISOString(),
          rentalEnd: faker.date.future().toISOString(),
          pickupTime: faker.date.future().toISOString(),
          returnTime: faker.date.future().toISOString(),
          requiresDriver: faker.datatype.boolean(),
          requiresDelivery: faker.datatype.boolean(),
          travelRegion: faker.location.state(),
          estimatedDistance: faker.number.int({ min: 50, max: 1000 }).toString(),
          username: faker.person.firstName(),
          surname: faker.person.lastName(),
          usersFatherName: faker.person.middleName(),
          driverLicence: faker.string.alphanumeric(10),
          passport: faker.string.alphanumeric(9),
          address: faker.location.streetAddress(),
          passportImages: Array(2).fill(null).map(() => faker.image.url()),
          driverLicenceImages: Array(2).fill(null).map(() => faker.image.url()),
          status: faker.helpers.arrayElement(['NEW', 'ACCEPTED', 'DECLINED']),
          isActive: faker.datatype.boolean(),
        }
      })
    )
  );

  // Generate fake favorites
  await Promise.all(
    Array(25).fill(null).map(() => 
      prisma.favorite.create({
        data: {
          carId: faker.helpers.arrayElement(cars).id,
          userId: faker.helpers.arrayElement(users).id,
        }
      })
    )
  );

  // Generate fake discounts
  const allCarIds = cars.map(car => car.id);
  const shuffledCarIds = allCarIds.sort(() => 0.5 - Math.random());
  const allBrandIds = brands.map(brand => brand.id);
  const shuffledBrandIds = allBrandIds.sort(() => 0.5 - Math.random());
  
  await Promise.all(
    Array(Math.min(10, cars.length, brands.length)).fill(null).map((_, index) => 
      prisma.discount.create({
        data: {
          carId: shuffledCarIds[index],
          brendId: shuffledBrandIds[index],
          startDate: faker.date.past().toISOString(),
          endDate: faker.date.future().toISOString(),
        }
      })
    )
  );

  // Generate fake user reviews
  await Promise.all(
    Array(20).fill(null).map(() => 
      prisma.userReviews.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          review: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
        }
      })
    )
  );

  // Generate fake car reviews
  await Promise.all(
    Array(30).fill(null).map(() => 
      prisma.carRewiew.create({
        data: {
          carId: faker.helpers.arrayElement(cars).id,
          review: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
        }
      })
    )
  );

  console.log('Fake data generation completed.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());