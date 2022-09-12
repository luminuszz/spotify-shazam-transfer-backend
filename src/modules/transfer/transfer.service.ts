import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Jobs } from '@app/modules/transfer/jobs';
import { Readable } from 'node:stream';
import * as readline from 'readline';
import { ProcessSpotifyTrackJobData } from '@app/modules/transfer/jobs/process-spotify-track.job';

@Injectable()
export class TransferService {
  constructor(
    @InjectQueue(Jobs.ProcessSpotifyTrack)
    private readonly processSpotifyTrackQueue: Queue<ProcessSpotifyTrackJobData>,
  ) {}

  public async pushRawToQueue(csvFile: Express.Multer.File) {
    const readable = new Readable();

    readable.push(csvFile.buffer);
    readable.push(null);

    const trackLineInterface = readline.createInterface(readable);

    for await (const line of trackLineInterface) {
      const trackSplit = line.split(',');

      const data: ProcessSpotifyTrackJobData = {
        trackId: String(trackSplit[0]),
        track_name: trackSplit[2],
        track_artist: trackSplit[3],
      };

      await this.processSpotifyTrackQueue.add(data);
    }
  }
}
