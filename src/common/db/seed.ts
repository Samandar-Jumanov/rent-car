import { faker } from '@faker-js/faker';
import { PrismaClient, Role, PaymentType, CarDelivery, CarStatus, RentalType } from '@prisma/client';

const prisma = new PrismaClient();

const NUM_USERS = 50;
const NUM_BRANDS = 10;
const NUM_CARS_PER_BRAND = 5;
const NUM_RENTALS = 20;
const NUM_REVIEWS = 30;

async function main() {
  // Generate Users
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const user = await prisma.user.create({
      data: {
        phoneNumber: faker.phone.number(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        birthday: faker.date.past().toISOString(),
        verificationCode: faker.string.numeric(6),
        password: faker.internet.password(),
        isVerified: faker.datatype.boolean(),
        role: faker.helpers.arrayElement(Object.values(Role)),
      },
    });
    users.push(user);
  }

  // Generate Brands
  const brands = [];
  for (let i = 0; i < NUM_BRANDS; i++) {
    const brand = await prisma.brand.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        logo: faker.image.url(),
        brendName: faker.company.name(),
        ownerNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        password: faker.internet.password(),
        carDelivery: faker.helpers.arrayElement(Object.values(CarDelivery)),
        payment: faker.helpers.arrayElement(Object.values(PaymentType)),
        ratings: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
        averageRating: faker.number.int({ min: 1, max: 5 }),
      },
    });
    brands.push(brand);
  }

  // Generate Cars
  const cars = [];
  for (const brand of brands) {
    for (let i = 0; i < NUM_CARS_PER_BRAND; i++) {
      const car = await prisma.car.create({
        data: {
          brendId: brand.id,
          title: faker.vehicle.model(),
          carBrend: faker.vehicle.manufacturer(),
          price: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          isDiscounted: faker.datatype.boolean(),
          discountedPrice: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          color: faker.vehicle.color(),
          isAvailable: faker.datatype.boolean(),
          images: Array.from({ length: 3 }, () => faker.image.url()),
          status: faker.helpers.arrayElement(Object.values(CarStatus)),
          ratings: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
          averageRating: faker.number.int({ min: 1, max: 5 }),
        },
      });
      cars.push(car);
    }
  }

  // Generate Rentals
  for (let i = 0; i < NUM_RENTALS; i++) {
    await prisma.rental.create({
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
        userImage: faker.image.avatar(),
        username: faker.person.firstName(),
        surname: faker.person.lastName(),
        usersFatherName: faker.person.middleName(),
        driverLicence: faker.string.alphanumeric(10),
        passport: faker.string.alphanumeric(9),
        address: faker.location.streetAddress(),
        passportImages: Array.from({ length: 2 }, () => faker.image.url()),
        driverLicenceImages: Array.from({ length: 2 }, () => faker.image.url()),
        status: faker.helpers.arrayElement(Object.values(RentalType)),
        isActive: faker.datatype.boolean(),
      },
    });
  }

  // Generate Reviews
  for (let i = 0; i < NUM_REVIEWS; i++) {
    await prisma.reviews.create({
      data: {
        carId: faker.helpers.arrayElement(cars).id,
        brandId: faker.helpers.arrayElement(brands).id,
        userId: faker.helpers.arrayElement(users).id,
        review: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }

  // Generate Features
  for (const car of cars) {
    await prisma.feature.create({
      data: {
        carId: car.id,
        title: faker.vehicle.fuel(),
        icon: faker.internet.emoji(),
      },
    });
  }

  // Generate Requirements
  for (const car of cars) {
    await prisma.requirements.create({
      data: {
        carId: car.id,
        title: faker.lorem.word(),
        value: faker.lorem.sentence(),
        icon: faker.internet.emoji(),
      },
    });
  }

  // Generate Favorites
  for (const user of users) {
    await prisma.favorite.create({
      data: {
        carId: faker.helpers.arrayElement(cars).id,
        userId: user.id,
      },
    });
  }

  // Generate Discounts
  for (const brand of brands) {
    await prisma.discount.create({
      data: {
        brendId: brand.id,
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        discountPercentage: faker.number.int({ min: 5, max: 30 }),
        discountId: faker.string.uuid(),
      },
    });
  }

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