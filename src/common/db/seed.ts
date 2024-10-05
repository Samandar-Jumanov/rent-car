import prisma from "./prisma";

async function main() {
  const regions = [
    { name: "Toshkent shahri", cities: ["Toshkent"] },
    { name: "Qoraqalpog'iston Respublikasi", cities: ["Nukus", "Mo'ynoq", "Xo'jayli"] },
    { name: "Andijon viloyati", cities: ["Andijon", "Asaka", "Xonobod"] },
    { name: "Buxoro viloyati", cities: ["Buxoro", "G'ijduvon", "Kogon"] },
    { name: "Farg'ona viloyati", cities: ["Farg'ona", "Marg'ilon", "Qo'qon"] },
    { name: "Jizzax viloyati", cities: ["Jizzax", "G'allaorol", "Dustlik"] },
    { name: "Xorazm viloyati", cities: ["Urganch", "Xiva", "Pitnak"] },
    { name: "Namangan viloyati", cities: ["Namangan", "Chust", "Pop"] },
    { name: "Navoiy viloyati", cities: ["Navoiy", "Zarafshon", "Uchquduq"] },
    { name: "Qashqadaryo viloyati", cities: ["Qarshi", "Shahrisabz", "Muborak"] },
    { name: "Samarqand viloyati", cities: ["Samarqand", "Kattaqo'rg'on", "Urgut"] },
    { name: "Sirdaryo viloyati", cities: ["Guliston", "Yangiyer", "Shirin"] },
    { name: "Surxondaryo viloyati", cities: ["Termiz", "Denov", "Sho'rchi"] },
    { name: "Toshkent viloyati", cities: ["Nurafshon", "Angren", "Chirchiq", "Olmaliq"] }
  ];

  for (const region of regions) {
    const createdRegion = await prisma.regions.create({
      data: {
        name: region.name,
      },
    });

    for (const city of region.cities) {
      await prisma.cities.create({
        data: {
          name: city,
          regionId: createdRegion.id,
        },
      });
    }
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });