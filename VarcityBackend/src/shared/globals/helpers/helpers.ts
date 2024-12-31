import { config } from '@root/config';
import JWT from 'jsonwebtoken';

export class Helpers {
  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  static signToken(jwtPayload: object): string {
    return JWT.sign(jwtPayload, config.JWT_TOKEN!);
  }
}
