import { CacheModule, Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { ProcessSpotifyTrackJob } from '@app/modules/transfer/jobs/process-spotify-track.job';
import { BullModule } from '@nestjs/bull';
import { Jobs } from '@app/modules/transfer/jobs';
import { SpotifyModule } from '@app/modules/spotify/spotify.module';

@Module({
  imports: [
    SpotifyModule,
    CacheModule.register(),
    BullModule.registerQueue({
      name: Jobs.ProcessSpotifyTrack,
    }),
  ],
  providers: [TransferService, ProcessSpotifyTrackJob],
  controllers: [TransferController],
  exports: [ProcessSpotifyTrackJob],
})
export class TransferModule {}
