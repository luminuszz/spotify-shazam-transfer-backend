import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransferService } from '@app/modules/transfer/transfer.service';
import { Auth } from '@app/modules/spotify/auth.guard';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Auth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('csv'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.transferService.pushRawToQueue(file);

    return {
      message: 'File uploaded successfully',
    };
  }
}
