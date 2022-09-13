import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@app/app.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvVariables>,
  ) {}

  private createHashToken() {
    const client_id = this.configService.get('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get('SPOTIFY_CLIENT_SECRET');

    return Buffer.from(`Basic ${client_id}:${clientSecret}`).toString('base64');
  }

  private makeQueryParams(code: string) {
    const params = new URLSearchParams();

    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append(
      'redirect_uri',
      this.configService.get('SPOTIFY_REDIRECT_URI'),
    );

    params.append('client_id', this.configService.get('SPOTIFY_CLIENT_ID'));
    params.append(
      'client_secret',
      this.configService.get('SPOTIFY_CLIENT_SECRET'),
    );

    return params;
  }

  async requestRefreshToken(code: string) {
    const { data } = await this.httpService.axiosRef.post(
      'https://accounts.spotify.com/api/token?',
      this.makeQueryParams(code),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  async requestAccessToken(refreshToken: string) {
    const client_id = this.configService.get('SPOTIFY_CLIENT_ID');
    const client_secret = this.configService.get('SPOTIFY_CLIENT_SECRET');
    const redirect_uri = this.configService.get('SPOTIFY_REDIRECT_URI');

    const { data } = await this.httpService.axiosRef.post(
      'https://accounts.spotify.com/api/token?',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id,
        client_secret,
        redirect_uri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }
}
