import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { HttpService } from '@nestjs/axios';
import { SpotifyUser } from '@app/modules/spotify/dto/Spotify-user.dto';
import { SpotifyPlaylist } from '@app/modules/spotify/dto/spotify-playlist.dto';

import { AxiosResponse } from 'axios';
import { Tracks } from '@app/modules/spotify/dto/spotify-track.dto';

@Injectable()
export class SpotifyService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.httpService.axiosRef.interceptors.request.use(async (config) => {
      const accessToken = await this.cacheManager.get('access_token');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });
  }

  async getTrackByName(name: string) {
    const { data } = await this.httpService.axiosRef.get<any>(
      `https://api.spotify.com/v1/search?q=${name}&type=track&limit=1`,
    );

    return data;
  }

  async createPlaylist(name: string, userId: string): Promise<SpotifyPlaylist> {
    const { data } = await this.httpService.axiosRef.post<
      any,
      AxiosResponse<SpotifyPlaylist>
    >(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      name,
      description: 'Playlist created by Spotify Transfer',
      public: false,
    });

    return data;
  }

  public async getCurrentUser(): Promise<SpotifyUser> {
    const { data } = await this.httpService.axiosRef.get(
      'https://api.spotify.com/v1/me',
    );

    return data;
  }

  async addTracksToPlaylist(playlist_id: string, traks: string[]) {
    const { data } = await this.httpService.axiosRef.post<
      any,
      AxiosResponse<Tracks>
    >(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      uris: traks,
    });

    return data;
  }
}
