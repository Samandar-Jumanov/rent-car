import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function createBanners() {
  try {
    // Fetch all existing cars
    const cars = await prisma.car.findMany({
      select: { id: true, title: true }
    });

    console.log(`Found ${cars.length} cars. Creating banners...`);

    const banners = await Promise.all(
      cars.map(car => 
        prisma.banners.create({
          data: {
            title: `Featured: ${car.title}`,
            carId: car.id,
            choosenImage: faker.image.url({ width: 1024, height: 480 }),  // Banner-sized image
          },
        })
      )
    );

    console.log(`Successfully created ${banners.length} banners.`);

    // Log some sample banners
    console.log('Sample banners created:');
    banners.slice(0, 5).forEach(banner => {
      console.log(`- Banner ID: ${banner.id}, Title: ${banner.title}, Car ID: ${banner.carId}`);
    });

  } catch (error) {
    console.error('Error creating banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the banner creation function
createBanners()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });