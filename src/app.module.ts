import { CacheModule, Module } from '@nestjs/common';
import { TransferModule } from '@app/modules/transfer/transfer.module';
import { BullModule } from '@nestjs/bull';
import { SpotifyModule } from '@app/modules/spotify/spotify.module';
import { ConfigModule } from '@nestjs/config';

export type EnvVariables = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REDIRECT_URI: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env.local' }),
    CacheModule.register({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        port: 6379,
        host: 'localhost',
      },
    }),

    TransferModule,
    SpotifyModule,
  ],
})
export class AppModule {}
