import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransferService } from '@app/modules/transfer/transfer.service';
import { Auth } from '@app/modules/spotify/auth.guard';
import { SpotifyService } from '@app/modules/spotify/spotify.service';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Auth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('csv'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.transferService.pushRawToQueue(file);

    return {
      message: 'File uploaded successfully',
    };
  }
}
