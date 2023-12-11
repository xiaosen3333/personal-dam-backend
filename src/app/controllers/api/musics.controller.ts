import { Context, Get, HttpResponseOK, HttpResponseNotFound, ValidatePathParam, ValidateQueryParam, Delete, HttpResponseNoContent } from '@foal/core';
import { Music } from '../../entities';

export class MusicsController {
  // 获取所有音乐记录
  @Get()
  async readAllMusics(ctx: Context) {
    const musics = await Music.find();
    return new HttpResponseOK(musics);
  }

  // 根据 id 获取特定的音乐记录
  // @Get('/:musicId')
  // @ValidatePathParam('musicId', { type: 'number' })
  // async readMusicById(ctx: Context) {
  //   const musicId = ctx.request.params.musicId;
  //   const music = await Music.findOneBy({ id: musicId });

  //   if (!music) {
  //     return new HttpResponseNotFound();
  //   }

  //   return new HttpResponseOK(music);
  // }

  @Delete('/:musicid')
  @ValidatePathParam('musicid', { type: 'number' })
  async deleteMusic(ctx: Context) {
    const music = await Music.findOneBy({ id: ctx.request.params.id });

    if (!music) {
      return new HttpResponseNotFound();
    }

    await music.remove();

    return new HttpResponseNoContent();
  }

}
