import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

@Injectable()
export class SpotifyService {
  constructor(private readonly httpService: HttpService) {}

  async getTrackByName(name: string) {
    return this.httpService
      .get(
        'https://api.spotify.com/v1/search?q=track:' +
          name +
          '&type=track&limit=1',
      )
      .subscribe((response) => response);
  }

  async createSpotPlaylist(name: string, userId: string) {
    await this.httpService
      .post(`https://api.spotify.com/v1/users/${userId}/playlists`, { name })
      .subscribe((response) => response);
  }
}
