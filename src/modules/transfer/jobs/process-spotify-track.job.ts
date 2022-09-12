import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Jobs } from '@app/modules/transfer/jobs/index';
import { Job } from 'bull';

export type ProcessSpotifyTrackJobData = {
  trackId: string;
  track_name: string;
  track_artist: string;
};

@Processor(Jobs.ProcessSpotifyTrack)
export class ProcessSpotifyTrackJob {
  @Process()
  async processSpotifyTrackJob({
    data,
    progress,
  }: Job<ProcessSpotifyTrackJobData>) {
    const message = `process spotify track job: ${data.trackId}`;

    console.log({ message });

    await progress(message);

    return message;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing  job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `Job ${job.id} of type ${job.name} completed with result ${job.returnvalue}`,
    );
  }
}
