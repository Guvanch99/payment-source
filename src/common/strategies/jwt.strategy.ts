import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../infra/database/database.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';
import { usersTable } from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.databaseService.client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, +payload.id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('invalid token');
    }

    return user;
  }
}
