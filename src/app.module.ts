import { CacheModule, Module } from '@nestjs/common';
import { TransferModule } from '@app/modules/transfer/transfer.module';
import { BullModule } from '@nestjs/bull';
import { SpotifyModule } from '@app/modules/spotify/spotify.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        port: 6379,
      },
    }),
    CacheModule.register(),
    TransferModule,
    SpotifyModule,
  ],
})
export class AppModule {}
