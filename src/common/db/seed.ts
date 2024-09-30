import prisma from "./prisma";
import bcrypt from "bcrypt"


async function createSuperAdmin ( ) {
   await prisma.user.create({
       data : {
             phoneNumber : "+998950018222",
             role : "SUPER_ADMIN",
             password : await bcrypt.hash("adminPass123" , 12 )

       }
   })
}

createSuperAdmin().then(( res ) => {
        console.log("Super Admin created successfully")
}).catch((ex ) => {
      console.log(ex)
})