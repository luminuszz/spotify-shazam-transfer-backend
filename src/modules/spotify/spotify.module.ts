import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { SpotifyService } from '@app/modules/spotify/spotify.service';
import { AuthGuard } from '@app/modules/spotify/auth.guard';
import { AuthService } from '@app/modules/spotify/auth.service';

@Module({
  imports: [HttpModule],
  providers: [SpotifyService, AuthGuard, AuthService],
  exports: [SpotifyService, AuthGuard, HttpModule, AuthService],
})
export class SpotifyModule {}
