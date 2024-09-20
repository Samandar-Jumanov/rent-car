import { UserRepository } from "@/api/user/userRepository";
import { smsService } from "../sms/smsService";

export class UserVerificationService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async initiateVerification(phoneNumber: string): Promise<string> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    const verificationCode = this.generateVerificationCode();
    
    // Store the verification code in the database
    await this.userRepository.setVerificationCode(user.id, verificationCode);

    // Send the verification code
    await smsService.sendVerificationCode(phoneNumber, verificationCode);
    console.log("code sent")

    return 'Verification code sent';
  }

  async verifyUser(phoneNumber: string, code: string): Promise<boolean> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.verificationCode === code) {
      await this.userRepository.markAsVerified(user.id);
      return true;
    }

    return false;
  }
}

export const userVerificationService = new UserVerificationService();