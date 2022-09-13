import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Jobs } from '@app/modules/transfer/jobs';
import { Readable } from 'node:stream';
import { createInterface } from 'readline';
import { ProcessSpotifyTrackJobData } from '@app/modules/transfer/jobs/process-spotify-track.job';
import { SpotifyService } from '@app/modules/spotify/spotify.service';

@Injectable()
export class TransferService {
  constructor(
    @InjectQueue(Jobs.ProcessSpotifyTrack)
    private readonly processSpotifyTrackQueue: Queue<ProcessSpotifyTrackJobData>,

    private readonly spotifyService: SpotifyService,
  ) {}

  public async pushRawToQueue(csvFile: Express.Multer.File) {
    const { id } = await this.spotifyService.getCurrentUser();

    console.log({ id });

    const playlist = await this.spotifyService.createPlaylist(
      'shazam sync playlist',
      id,
    );

    const readable = new Readable();

    readable.push(csvFile.buffer, 'utf-8');

    readable.push(null);

    const trackLineInterface = createInterface(readable);

    for await (const line of trackLineInterface) {
      const trackSplit = line.split(',');

      const data: ProcessSpotifyTrackJobData = {
        trackId: String(trackSplit[0]),
        track_name: trackSplit[2],
        track_artist: trackSplit[3],
        playlist_id: playlist.id,
      };

      await this.processSpotifyTrackQueue.add(data);
    }
  }
}
