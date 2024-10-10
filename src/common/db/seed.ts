import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.create({
        data : {
              phoneNumber : "+99895 001 82 22",
              password : await hash("adminPass123" , 10),
              role : "SUPER_ADMIN"
        }
    })

  } catch (error) {
    console.error('Error creating banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the banner creation function
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });