import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const regions = [
    { name: 'Tashkent Region', city: 'Angren' },
    { name: 'Samarkand Region', city: 'Samarkand' },
    { name: 'Bukhara Region', city: 'Bukhara' },
    { name: 'Andijan Region', city: 'Andijan' },
    { name: 'Fergana Region', city: 'Fergana' },
    { name: 'Namangan Region', city: 'Namangan' },
    { name: 'Kashkadarya Region', city: 'Karshi' },
    { name: 'Surkhandarya Region', city: 'Termez' },
    { name: 'Navoiy Region', city: 'Navoiy' },
    { name: 'Karakalpakstan', city: 'Nukus' }
  ]

  for (const { name: regionName, city: cityName } of regions) {
    // Create region first
    const region = await prisma.regions.create({
      data: {
        name: regionName,
      },
    })

    // Create corresponding city
    await prisma.cities.create({
      data: {
        name: cityName,
        regionId: region.id,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })