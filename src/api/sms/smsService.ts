import { logger } from '@/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface SmsConfig {
  login: string;
  password: string;
}

interface SendParams {
  phone: string;
  message: string;
}

interface TokenData {
  data: {
    token: string;
  };
}

class Sms {
  #login: string;
  #password: string;

  constructor(config: SmsConfig) {
    this.#login = config.login;
    this.#password = config.password;
  }

  async auth(){
    try {
      const response = await axios.post<TokenData>(
        "https://notify.eskiz.uz/api/auth/login",
        {
          email: this.#login,
          password: this.#password,
        }
      );
      
      const data = response.data;
      logger.info({  tokenData : data });
      if (data.data.token) {
        return data.data.token;
      } else {
        throw new Error('Failed to obtain authorization token');
      }

    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async send({ phone, message }: SendParams): Promise<any> {
    try {
       const token = await this.auth()

      const config = {
        method: 'post' as const,
        maxBodyLength: Infinity,
        url: "https://notify.eskiz.uz/api/message/sms/send",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          mobile_phone: phone,
          message: message,
          from: 4546,
        },
      };

      const response = await axios(config);
      console.log({ response })
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          await this.auth();
          return this.send({ phone, message });
        }

        return {
          error: true,
          message: error.response.data.message,
          status: error.response.status,
        };
      }

      throw error;
    }
  }
 
}

const config = { login :  process.env.ESKIZ_EMAIL!, password : process.env.ESKIZ_PASSWORD!}
const smsService = new Sms(config)

export default smsService

