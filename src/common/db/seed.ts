import prisma from "./prisma";
import bcrypt from "bcrypt";

async function generateFakeData() {
  await prisma.user.create({
           data : {
                    phoneNumber : "+99895 001 82 22", 
                    role : "SUPER_ADMIN",
                    password : await bcrypt.hash("adminPass123" , 10 )
           }
  })
  console.log("Fake data generation completed successfully!");
}

generateFakeData()
  .then(() => {
    console.log("Fake data generation process finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error generating fake data:", error);
    process.exit(1);
  });