import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import smsService from "../sms/smsService";

class SendSmsApiWithEskiz {
    private message: string;
    private phone: string;

    constructor(message: string, phone: string) {
        this.message = this.cleanMessage(message);
        this.phone = this.formatPhoneNumber(phone);
    }

    private cleanMessage(message: string): string {
        return message.replace(/[^\w\s.,!?-]/gi, '');
    }

    private formatPhoneNumber(phone: string): string {
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length === 12 && cleanedPhone.startsWith('998')) {
            return cleanedPhone;
        } else if (cleanedPhone.length === 9) {
            return `998${cleanedPhone}`;
        } else {
            throw new Error(`Invalid phone number format: ${phone}`);
        }
    }

    async send(): Promise<number> {
        try {
            const sendSmsData = {
                  phone : this.phone,
                  message : this.message
            }
            
            const status = await smsService.send(sendSmsData);
            logger.info(`SMS sent successfully to ${this.phone}. Status: ${status}`);
            return status;
        } catch (error) {
            logger.error(`Failed to send SMS to ${this.phone}:`, error);
            throw error;
        }
    }
}

export class UserVerificationService {
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async initiateVerification(phoneNumber: string): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({ where: { phoneNumber } });
            if (!user) {
                   return  false 
            }

            const verificationCode = this.generateVerificationCode();
            await prisma.user.update({
                where: { id: user.id },
                data: { verificationCode },
            });

            const smsApi = new SendSmsApiWithEskiz(
                `Your verification code is: ${verificationCode}`,
                 phoneNumber
            );

            try {
                await smsApi.send();
                return true
            } catch (smsError) {
                logger.error(`SMS sending failed for ${phoneNumber}: ${(smsError as Error).message}`);
                return false
            }

        } catch (ex) {
            const errorMessage = `Error initiating verification for ${phoneNumber}: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return false

        }
    }
}

export const userVerificationService = new UserVerificationService();
