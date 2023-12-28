import { Context,File, Delete, Get, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, ValidatePathParam } from '@foal/core';
import { Image, Kind1,  MediaType } from '../../entities';
import { ParseAndValidateFiles } from '@foal/storage';
import path = require('path');
import * as fs from 'fs';
export class ImageController {

  @Get()
  async readAllimages(ctx: Context) {
    const images = await Image.find();
    return new HttpResponseOK(images);
  }

  @Post()
  @ParseAndValidateFiles(
    {
      cover: { required: false, saveTo: 'images/covers' },
      url: { required: false, saveTo: 'images/urls' },
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
  async createImage(ctx: Context) {
    const image = new Image();
    image.name = ctx.request.body.name;
    image.artist = ctx.request.body.artist;
    image.type = MediaType.ImageType;
    image.kind = Kind1[ctx.request.body.kind as keyof typeof Kind1] ;

    // Warning: File must be imported from `@foal/core`.
    const coverFile: File|undefined = ctx.files.get('cover')[0];
    if (coverFile) {
      image.cover = coverFile.path;
    }

    const urlFile: File|undefined = ctx.files.get('url')[0];
    if (urlFile) {
      image.url = urlFile.path;
    }

    await image.save();

    return new HttpResponseOK(image);
  }

  @Delete('/:imageid')
  @ValidatePathParam('imageid', { type: 'number' })
  async deleteImage(ctx: Context) {
    const image = await Image.findOneBy({ id: ctx.request.params.id });

    if (!image) {
      return new HttpResponseNotFound();
    }

    await image.remove();

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
  @Get('/download/:imageid')
  @ValidatePathParam('imageid', { type: 'number' })
  async downloadFile(ctx: Context) {
    const fileId = ctx.request.params.imageid;
    const file = await Image.findOneBy({ id: fileId });
  
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
