import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';

import { Cache } from 'cache-manager';
import { EnvVariables } from '@app/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { AuthService } from '../spotify/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly configService: ConfigService<EnvVariables>,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  private isTokenExpiredError(error: any): boolean {
    return (
      error.response.data.error === 'invalid_grant' &&
      error.response.status === 400
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessCode = request.headers.authorization?.split(' ')[1];

    try {
      const data = await this.authService.requestRefreshToken(accessCode);

      console.log({ data });

      await this.cacheManager.set('access_token', data.access_token, {
        ttl: 0,
      });
      await this.cacheManager.set('refresh_token', data.refresh_token, {
        ttl: 0,
      });

      return true;
    } catch (e) {
      console.log({ e: e.response.data });

      if (this.isTokenExpiredError(e)) {
        const refreshToken = await this.cacheManager.get<string>(
          'refresh_token',
        );

        if (!refreshToken) return false;

        const data = await this.authService.requestAccessToken(refreshToken);

        await this.cacheManager.set('access_token', data.access_token);

        return true;
      }

      return false;
    }
  }
}

export const Auth = () => UseGuards(AuthGuard);
