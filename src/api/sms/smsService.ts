// File: smsService.ts
import axios from 'axios';
import { logger } from '@/server';


const ESKIZ_PASSWORD = process.env.ESKIZ_PASSWORD;
const ESKIZ_EMAIL = process.env.ESKIZ_EMAIL;


async function getAuthToken(): Promise<string> {
    const AUTHORIZATION_URL = 'http://notify.eskiz.uz/api/auth/login';
    try {
        const response = await axios.post(AUTHORIZATION_URL, {
            email: ESKIZ_EMAIL,
            password: ESKIZ_PASSWORD,
        });
        if (response.data.data.token) {
            return response.data.data.token;
        } else {
            throw new Error('Failed to obtain authorization token');
        }
    } catch (error) {
        logger.error('Authorization error:', error);
        throw new Error('Authorization failed');
    }
}

export default async function sendMessage(message: string, phone: string): Promise<number> {
    try {
        const token = await getAuthToken();
        const SEND_SMS_URL = "http://notify.eskiz.uz/api/message/sms/send";
        const response = await axios.post(SEND_SMS_URL, 
            {
                mobile_phone: phone,
                message: message,
                from: '4546'
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        // issue is being occured / 400 bad request 
        logger.info(`SMS sent. Response: ${JSON.stringify(response.data)}`);
        return response.status;
    } catch (error) {
        logger.error('Send message error:', error);
        throw error;
    }
}

