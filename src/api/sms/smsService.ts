import twilioClient from '../twilio/twilioService';

export class SmsService {
  private maxRetries = 3;
  private retryDelay = 1000;

  async sendSms(to: string, body: string): Promise<string> {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const message = await twilioClient.messages.create({
          body,
          to,
          from: process.env.TWILIO_PHONE_NUMBER,
        });

        console.log(`SMS sent successfully ${process.env.TWILIO_PHONE_NUMBER} to ${to}:`, message.sid);

        return message.sid;
      } catch (error) {
        console.error(`Error sending SMS (attempt ${retries + 1}):`, error);
        retries++;
        if (retries >= this.maxRetries) {
          throw new Error('Max retries reached. SMS could not be sent.');
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    throw new Error('Unexpected error in sendSms');
  }

  async sendVerificationCode(to: string, code: string): Promise<string> {
    return this.sendSms(to, `Your verification code is: ${code}`);
  }
}

export const smsService = new SmsService();