import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Jobs } from '@app/modules/transfer/jobs/index';
import { Job } from 'bull';
import * as fs from 'fs/promises';
import { SpotifyService } from '@app/modules/spotify/spotify.service';

export type ProcessSpotifyTrackJobData = {
  trackId: string;
  track_name: string;
  track_artist: string;
  playlist_id: string;
};

@Processor(Jobs.ProcessSpotifyTrack)
export class ProcessSpotifyTrackJob {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Process()
  async processSpotifyTrackJob(job: Job<ProcessSpotifyTrackJobData>) {
    console.log('data', job.data.track_name);

    const { tracks } = await this.spotifyService.getTrackByName(
      `${job.data.track_name} - ${job.data.track_artist}`,
    );

    await this.spotifyService.addTracksToPlaylist(job.data.playlist_id, [
      tracks.items[0].uri,
    ]);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing  job ${job.id} of type ${job.name} with data ${job.data.trackId}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed with result ${job.data.track_name}`);
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    await fs.appendFile(
      'failed.txt',
      `${job.data.track_name} - ${job.data.track_artist} - ${job.data.trackId} \n`,
    );
  }
}
