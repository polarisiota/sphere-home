import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SigninDto, SignupDto } from './dto';
import { logger } from 'src/helper/logger.helper';
import { ERROR_LIST } from 'src/helper/errors.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signin(dto: SigninDto) {
    try {
      // find user
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user)
        return {
          statuscode: 500,
          status: 'error',
          data: null,
          message: ERROR_LIST.AUTH.SIGNIN_FAILED,
        };

      // return token
      return {
        statusCode: 201,
        status: 'success',
        data: {
          accessToken: (await this.signToken({ userId: user.id })).accessToken,
        },
        message: null,
      };
    } catch (e) {
      logger.error(`auth signin: dto: ${dto} error: ${e}`);
      return {
        statuscode: 500,
        status: 'error',
        data: null,
        message: ERROR_LIST.AUTH.SIGNIN_FAILED,
      };
    }
  }

  async signup(dto: SignupDto) {
    try {
      //TODO: check email, password

      const hash = await argon.hash(dto.password);

      const user = this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      if (user) {
        return {
          statusCode: 201,
          status: 'success',
          data: {
            user,
          },
          message: null,
        };
      } else {
        return {
          statusCode: 400,
          status: 'error',
          data: null,
          message: [ERROR_LIST.AUTH.SIGNUP_FAILED],
        };
      }
    } catch (e) {
      logger.error(`auth signup: dto: ${dto} error: ${e}`);
      return {
        statuscode: 500,
        status: 'error',
        data: null,
        message: ERROR_LIST.AUTH.SIGNUP_FAILED,
      };
    }
  }

  async signToken({
    userId,
  }: {
    userId: number;
  }): Promise<{ accessToken: string }> {
    const secret = this.config.get<string>('JWT_SECRET');
    const lifeTime = this.config.get<string>('JWT_LIFE_TIME');
    const payload = {
      sub: userId,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: lifeTime,
      secret: secret,
    });
    return { accessToken };
  }
}
