import prisma from "./prisma";
import bcrypt from "bcrypt"


async function createSuperAdmin ( ) {

   await prisma.carColor.create({
       data : {
              color : "Black"

       }
   })
   

   await prisma.carBrend.create({
      data : {
              carBrend: "Bmw"

      }
  })

  await prisma.model.create({
      data : {
              modelName: "Bmw E 32 "
      }
  })
  
}

createSuperAdmin().then(( res ) => {
        console.log("Fake data done ")
}).catch((ex ) => {
      console.log(ex)
})