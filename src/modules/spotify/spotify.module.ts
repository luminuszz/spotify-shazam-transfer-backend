import { CacheModule, Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { SpotifyService } from '@app/modules/spotify/spotify.service';
import { AuthGuard } from '@app/modules/spotify/auth.guard';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [SpotifyService, AuthGuard],
  exports: [SpotifyService, AuthGuard],
})
export class SpotifyModule {}
