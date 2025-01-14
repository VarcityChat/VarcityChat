import { config } from '@root/config';
import JWT from 'jsonwebtoken';

export class Helpers {
  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  static signToken(jwtPayload: object): string {
    return JWT.sign(jwtPayload, config.JWT_TOKEN!);
  }

  static generateOtp(len: number): string {
    const numbers = '0123456789';
    let otp = '';
    for (let i = 0; i < len; i++) {
      otp += Math.floor(Math.random() * numbers.length);
    }
    return otp;
  }
}
