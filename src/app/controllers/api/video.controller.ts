import { Context, Delete,File, Get, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, ValidatePathParam } from '@foal/core';
import { Kind1, MediaType, Video } from '../../entities';
import { ParseAndValidateFiles } from '@foal/storage';
import path = require('path');
import * as fs from 'fs';
export class VideoController {

  @Get()
  async readAllVideos(ctx: Context) {
    const videos = await Video.find();
    return new HttpResponseOK(videos);
  }

  @Post()
  @ParseAndValidateFiles(
    {
      cover: { required: false, saveTo: 'videos/covers' },
      url: { required: false, saveTo: 'videos/urls' },
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string' },
        artist: { type: 'string' },
        type: { type: 'string' }, // 根据 MediaType 的定义调整
        kind: { type: 'string' } // 根据 Kind1 和 Kind2 的定义调整
      },
      required: ['name', 'artist',  'kind']
    }
  )
  async createVideo(ctx: Context) {
    const video = new Video();
    video.name = ctx.request.body.name;
    video.artist = ctx.request.body.artist;
    video.type = MediaType.VideoType;
    video.kind = Kind1[ctx.request.body.kind as keyof typeof Kind1];

    // Warning: File must be imported from `@foal/core`.
    const coverFile: File|undefined = ctx.files.get('cover')[0];
    if (coverFile) {
      video.cover = coverFile.path;
    }

    const urlFile: File|undefined = ctx.files.get('url')[0];
    if (urlFile) {
      video.url = urlFile.path;
    }


    await video.save();

    return new HttpResponseOK(video);
  }

  @Delete('/:videoid')
  @ValidatePathParam('videoid', { type: 'number' })
  async deleteVideo(ctx: Context) {
    const video = await Video.findOneBy({ id: ctx.request.params.id });

    if (!video) {
      return new HttpResponseNotFound();
    }

    await video.remove();

    return new HttpResponseNoContent();
  }

  getMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.mp4':
        return 'video/mp4';
      case '.webp':
        return 'image/webp'
      // 添加更多的文件类型和 MIME 类型
      default:
        return 'application/octet-stream';
    }
  }
  @Get('/download/:videoid')
  @ValidatePathParam('videoid', { type: 'number' })
  async downloadFile(ctx: Context) {
    const fileId = ctx.request.params.videoid;
    const file = await Video.findOneBy({ id: fileId });
  
    if (!file || !file.url) {
      return new HttpResponseNotFound();
    }
  
    const filePath = path.resolve(__dirname, '../../../../public/', file.url);
    if (!fs.existsSync(filePath)) {
      return new HttpResponseNotFound();
    }
  
    const fileContent = fs.readFileSync(filePath);
    const response = new HttpResponseOK(fileContent);
  
    // 根据文件类型设置不同的 Content-Type
    response.setHeader('Content-Type', this.getMimeType(filePath));
    response.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    return response;
  }
}
