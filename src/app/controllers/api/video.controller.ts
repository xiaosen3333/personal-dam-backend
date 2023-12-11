import { Context, Delete, Get, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, ValidatePathParam } from '@foal/core';
import { Video } from '../../entities';
export class VideoController {

  @Get()
  async readAllVideos(ctx: Context) {
    const videos = await Video.find();
    return new HttpResponseOK(videos);
  }

  // 根据 id 获取特定的音乐记录
  // @Get('/:videoId')
  // @ValidatePathParam('videoId', { type: 'number' })
  // async readVideoById(ctx: Context) {
  //   const videoId = ctx.request.params.videoId;
  //   const video = await Video.findOneBy({ id: videoId });

  //   if (!video) {
  //     return new HttpResponseNotFound();
  //   }

  //   return new HttpResponseOK(video);
  // }

  @Delete('/:videoid')
  @ValidatePathParam('videoid', { type: 'number' })
  async deleteMusic(ctx: Context) {
    const music = await Video.findOneBy({ id: ctx.request.params.id });

    if (!music) {
      return new HttpResponseNotFound();
    }

    await music.remove();

    return new HttpResponseNoContent();
  }
}
