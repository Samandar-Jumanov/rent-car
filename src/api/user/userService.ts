import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import {userVerificationService} from "../user-verfication/userVerficationService"
import { CreateUserRequest } from "@/api/user/userModel";
export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User[]>("Users found", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(data: string): Promise<ServiceResponse<User | null>> {
    try {
      const existingUser = await this.userRepository.findByIdAsync(3);
      if (existingUser) {
        return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
      }

      const newUser: User = {
        id: Math.floor(Math.random() * 10000), 
        phoneNumber: data,

        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
      };

      const savedUser = await this.userRepository.createAsync(newUser);

      // Initiate verification process
      await userVerificationService.initiateVerification(savedUser.phoneNumber);

      return ServiceResponse.success<User>("User created and verification initiated", savedUser);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyUser(phoneNumber: string, code: string): Promise<ServiceResponse<boolean>> {
    try {
      const isVerified = await userVerificationService.verifyUser(phoneNumber, code);
      if (isVerified) {
        return ServiceResponse.success<boolean>("User verified successfully", true);
      } else {
        return ServiceResponse.failure("Invalid verification code", false, StatusCodes.BAD_REQUEST);
      }
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
}

export const userService = new UserService();


