import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { DatabaseService } from '../../infra/database/database.service';
import { LoginDto, RegisterDto } from './dto';
import { usersTable } from '../../schema';
import { eq } from 'drizzle-orm';
import { hash, verify } from 'argon2';
import { JwtPayload } from '../../common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { Response, Request } from 'express';
import { isDev } from '../../common/utils';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async logout(res: Response) {
    return this.setCookie(res, '', new Date());
  }

  public async register(dto: RegisterDto, res: Response) {
    const [exists] = await this.databaseService.client
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (exists) {
      throw new ConflictException('User is exists');
    }
    const hashedPassword = await hash(dto.password);

    const [user] = await this.databaseService.client
      .insert(usersTable)
      .values({ ...dto, password: hashedPassword })
      .returning({ id: usersTable.id });

    return this.auth(res, user.id);
  }

  public async login(dto: LoginDto, res: Response) {
    const [user] = await this.databaseService.client
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new NotFoundException('Invalid Credentials');
    }

    return this.auth(res, user.id);
  }

  private async auth(res: Response, userId: number) {
    const { accessToken, refreshToken, refreshTokenExpires } =
      await this.generateTokens(userId);

    this.setCookie(res, refreshToken, refreshTokenExpires);

    return {
      accessToken,
    };
  }

  public async refresh(res: Response, req: Request) {
    if (!req || !req.cookies) {
      throw new UnauthorizedException('No cookies');
    }

    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      const payload: JwtPayload =
        await this.jwtService.verifyAsync(refreshToken);

      const [user] = await this.databaseService.client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, +payload.id))
        .limit(1);

      if (user) {
        return this.auth(res, user.id);
      }
    }
  }

  private async generateTokens(userId: number) {
    const payload: JwtPayload = {
      id: userId.toString(),
    };

    const accessTokenTTL = this.configService.getOrThrow<StringValue>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    const refreshTokenTTL = this.configService.getOrThrow<StringValue>(
      'JWT_REFRESH_TOKEN_TTL',
    );

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenTTL,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenTTL,
    });
    const refreshTokenExpires = new Date(Date.now() + ms(refreshTokenTTL));

    return {
      accessToken,
      refreshTokenExpires,
      refreshToken,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      expires,
      secure: !isDev(this.configService),
      sameSite: 'lax',
    });
  }
}
