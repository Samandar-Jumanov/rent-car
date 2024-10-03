import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
// import { userVerificationService } from "../user-verfication/userVerficationService";
import prisma from "@/common/db/prisma";
import { CreateUserRequest, IUser, UpdateUserRequest } from "./userModel";
import { generateToken , verifyToken } from "@/common/utils/jwt";
import { IRental } from "../brend/cars/carsModel";
import { ISessions } from "./sessions/sessions.model";
import bcrypt from "bcrypt"

export class UserService {
  async findAll(): Promise<ServiceResponse<IUser[] | null>> {
    try {

      const users = await prisma.user.findMany({
          where : {  role  : "AGENT"},
          include : {
              sessions: true , 
              rentals : true ,
              blockedByAdmin : true
          }
      });
      return ServiceResponse.success<IUser[]>("Users found", users as IUser[]);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUser(id: string): Promise<ServiceResponse<IUser | null>> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IUser>("User found", user as IUser );
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(
    data: CreateUserRequest,
    queryData: { location: string; role: "USER" | "AGENT"  }
  ): Promise<ServiceResponse<{ token: string } | null>> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber: data.phoneNumber },
      });
  
      let user;
  
      if (existingUser) {
        // User exists
        if (queryData.role === "AGENT") {
          const isValid = await bcrypt.compare(String(data.password), String(existingUser.password));
          if (!isValid) {
            return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
          }
        }
        // For USER and AGENT (after password verification), use existing user
        user = existingUser;
      } else {
        // User doesn't exist, create new user
        if (queryData.role === "AGENT") {
          if (!data.password) {
            return ServiceResponse.failure("Password required for new agent", null, StatusCodes.BAD_REQUEST);
          }
          user = await prisma.user.create({
            data: {
              phoneNumber: data.phoneNumber,
              role: queryData.role,
              password: data.password,
            },
          });
        } else {
          // For USER role, create without password
          user = await prisma.user.create({
            data: {
              phoneNumber: data.phoneNumber,
              role: queryData.role,
            },
          });
        }
      }
  
      // Generate token
      const token = generateToken({
        phoneNumber: user.phoneNumber,
        userId: user.id,
        role: user.role,
      });
  
      return ServiceResponse.success("User processed successfully", { token });
    } catch (ex) {
      const errorMessage = `Error in createUser: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyUser(code: string, phoneNumber: string): Promise<ServiceResponse<{ token : string} | boolean>> {
    try {
      logger.info(`Verifying ${phoneNumber}`)
      const user = await prisma.user.findUnique({ where: { phoneNumber } });

      if (!user) {
        return ServiceResponse.failure("User not found", false, StatusCodes.NOT_FOUND);
      }

      if (user.verificationCode === code) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true, verificationCode: null },
        });

        const token = generateToken({phoneNumber: user.phoneNumber ,userId : user.id , role : user.role})
        return ServiceResponse.success("User verified successfully", { token});
      }
      return ServiceResponse.failure("Invalid verification code", false, StatusCodes.BAD_REQUEST);
    } catch (ex) {
      const errorMessage = `Error verifying user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while verifying user.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async updateUser(data : UpdateUserRequest  , id : string) : Promise<ServiceResponse<IUser | null>> {
    
    try {

      const user = await prisma.user.findUnique({
         where   : {  id }
      })

      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

     const updatedUser =   await prisma.user.update({
          where : { id },
          data : {
              ...data
          }
      })

      return ServiceResponse.success<IUser>("User updated sucessfully", updatedUser as IUser );
    } catch (ex) {
      const errorMessage = `Error verifying user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse<{ token: string } | null>> {
    try {
      const decoded = verifyToken(refreshToken);
      
      if (!decoded || typeof decoded === 'string') {
        return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.UNAUTHORIZED);
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const newToken = generateToken({ phoneNumber: user.phoneNumber, userId: user.id , role : user.role });

      return ServiceResponse.success("Token refreshed successfully", { token: newToken });
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while refreshing token.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getRentals( userId : string  , role : string ) : Promise<ServiceResponse<IRental[] | null>> {
    try {
        const user = await prisma.user.findUnique({ where :  {id : userId} , include : { rentals : {
            include : {
                  user : role === "ADMIN",
                  car : true,
                  requirements  : true 
            }
        } }});
        
        if (!user) {
          return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
        };

        return ServiceResponse.success<IRental[]>("Rentals found", user.rentals as IRental[] );
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while refreshing token.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage( image : string , userId : string  ) : Promise<ServiceResponse<IUser | null>> {
    try {
       const user = await prisma.user.findUnique({ where : { id : userId}})
        
        if (!user) {
          return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
        };


        const updatedUser = await prisma.user.update({
              where : { id : userId },
              data : {
                  image : image
              }
        })
        
        return ServiceResponse.success("Uploaded succefully", updatedUser  as IUser );
    } catch (ex) {
      const errorMessage = `Something went wrong ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while refreshing token.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeSession (  sessionsId: string)  : Promise<ServiceResponse<ISessions | null>> {
    try {
     const session = await prisma.sessions.findUnique({
        where : { id : sessionsId},
        include : {
           user : true 
        }
     })

     if (!session) {
      return ServiceResponse.failure("Session not found", null, StatusCodes.NOT_FOUND);
     };

     if(session?.isOwner) {
       return ServiceResponse.failure("You cannot main account session", null, StatusCodes.NOT_FOUND);
     }
     await prisma.sessions.delete({
        where : { id : sessionsId}
     })

     return ServiceResponse.success("Session deleted succesfully", session , StatusCodes.OK );

  } catch (ex) {
    const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure(
      "An error occurred while deleting  sessiobn.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  }

  async adminLogin ( data : { phoneNumber: string , password : string}) {
    try {

     const phoneNumber = data.phoneNumber.startsWith('+') ? data.phoneNumber : `+${data.phoneNumber}`;
     const user = await prisma.user.findUnique({ where: { phoneNumber } });
      
      if (!user) {
        logger.warn("User not foudn")
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      

      logger.warn({ data })
      const validPassword = await bcrypt.compare(data.password, String(user.password));

     logger.warn(`Password validation result: ${validPassword ? 'Valid' : 'Invalid'}`);

    if (!validPassword) {
      return ServiceResponse.failure("Invalid credentials", null, StatusCodes.BAD_REQUEST);
    };

      const token = generateToken({ phoneNumber: user.phoneNumber, userId: user.id , role : user.role });
      return ServiceResponse.success("Logged in successfully", { token });
    } catch (ex) {
      const errorMessage = `Error logging in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while logging in.",
        null,
      )
   }  
}
}


export const userService = new UserService();