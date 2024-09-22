import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { smsService } from "../sms/smsService";

export class UserVerificationService {
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async initiateVerification(phoneNumber: string): Promise<ServiceResponse<string | null>> {
    try {
      const user = await prisma.user.findUnique({ where: { phoneNumber } });
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const verificationCode = this.generateVerificationCode();
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationCode },
      });

      await smsService.sendVerificationCode(phoneNumber, verificationCode);
      return ServiceResponse.success("Verification code sent", "Verification code sent");


    } catch (ex) {
      const errorMessage = `Error initiating verification: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while initiating verification.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const userVerificationService = new UserVerificationService();