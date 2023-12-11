import { Context, Delete, Get, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, ValidatePathParam } from '@foal/core';
import { Image } from '../../entities';
export class ImageController {

  @Get()
  async readAllimages(ctx: Context) {
    const images = await Image.find();
    return new HttpResponseOK(images);
  }

  // 根据 id 获取特定的音乐记录
  // @Get('/:imageId')
  // @ValidatePathParam('imageId', { type: 'number' })
  // async readimageById(ctx: Context) {
  //   const imageId = ctx.request.params.imageId;
  //   const image = await Image.findOneBy({ id: imageId });

  //   if (!image) {
  //     return new HttpResponseNotFound();
  //   }

  //   return new HttpResponseOK(image);
  // }

  @Delete('/:imageid')
  @ValidatePathParam('imageid', { type: 'number' })
  async deleteMusic(ctx: Context) {
    const music = await Image.findOneBy({ id: ctx.request.params.id });

    if (!music) {
      return new HttpResponseNotFound();
    }

    await music.remove();

    return new HttpResponseNoContent();
  }
}
