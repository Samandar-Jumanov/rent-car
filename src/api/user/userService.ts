import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { userVerificationService } from "../user-verfication/userVerficationService";
import prisma from "@/common/db/prisma";
import { IUser, UpdateUserRequest } from "./userModel";
import { generateToken } from "@/common/utils/jwt";

export class UserService {
  async findAll(): Promise<ServiceResponse<IUser[] | null>> {
    try {

      const users = await prisma.user.findMany();

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

  async createUser(data: string ): Promise<ServiceResponse<IUser | null>> {
    try {
      // will create or find new user 

      let user

      const existingUser = await prisma.user.findUnique({
          where  : { phoneNumber : data}
      });

      if(!existingUser){
          user = await prisma.user.create({
              data: { phoneNumber: data }
          });
      } else {
             user = existingUser
      }


      await userVerificationService.initiateVerification(user.phoneNumber);

    
      return ServiceResponse.success<IUser>("User created and verification initiated", user as IUser);
    } catch (ex) {
      console.log({ ex })
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
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

        const token = generateToken({phoneNumber: user.phoneNumber ,userId : user.id})
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
        "An error occurred while verifying user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const userService = new UserService();