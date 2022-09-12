import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';

import { Cache } from 'cache-manager';
import { SpotifyService } from '@app/modules/spotify/spotify.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private spotifyService: SpotifyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return false;
    }

    await this.cacheManager.set('accessToken', accessToken);

    return true;
  }
}

export const Auth = () => UseGuards(AuthGuard);
