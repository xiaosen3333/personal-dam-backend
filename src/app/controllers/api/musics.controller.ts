import { Context, Get, HttpResponseOK, HttpResponseNotFound, ValidatePathParam, ValidateQueryParam, Delete, HttpResponseNoContent, Post, ValidateBody, dependency, File, HttpResponse } from '@foal/core';
import * as mime from 'mime';
import { Kind1, MediaType, Music } from '../../entities';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import * as fs from 'fs';
import * as path from 'path';

export class MusicsController {

  @dependency
  disk: Disk;
  // 获取所有音乐记录
  @Get()
  async readAllMusics(ctx: Context) {
    const musics = await Music.find();
    return new HttpResponseOK(musics);
  }

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

  @Post()
  @ParseAndValidateFiles(
    {
      cover: { required: false, saveTo: 'musics/covers' },
      url: { required: false, saveTo: 'musics/urls' },
      text: { required: false, saveTo: 'musics/texts' }
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string' },
        artist: { type: 'string' },
        type: { type: 'string' }, // is it a music or an image or a video根据 MediaType 的定义调整
        kind: { type: 'string' } // is it for programming or sleeping...根据 Kind1 和 Kind2 的定义调整
      },
      required: ['name', 'artist', 'kind']
    }
  )
  async createMusic(ctx: Context) {
    const music = new Music();
    music.name = ctx.request.body.name;
    music.artist = ctx.request.body.artist;
    music.type = MediaType.MusicType;
    music.kind = Kind1[ctx.request.body.kind as keyof typeof Kind1];

    // Warning: File must be imported from `@foal/core`.
    const coverFile: File | undefined = ctx.files.get('cover')[0];
    if (coverFile) {
      music.cover = coverFile.path;
    }

    const urlFile: File | undefined = ctx.files.get('url')[0];
    if (urlFile) {
      music.url = urlFile.path;
    }

    const textFile: File | undefined = ctx.files.get('text')[0];
    if (textFile) {
      music.text = textFile.path;
    }

    await music.save();

    return new HttpResponseOK(music);
  }

  @Get('/download/:musicid')
  @ValidatePathParam('musicid', { type: 'number' })
  async downloadMusic(ctx: Context) {
    const musicId = ctx.request.params.musicid;
    const music = await Music.findOneBy({ id: musicId });
  
    if (!music || !music.url) {
      return new HttpResponseNotFound();
    }
  
    const filePath = path.resolve(__dirname, '../../../../public/', music.url);
    if (!fs.existsSync(filePath)) {
      return new HttpResponseNotFound();
    }
  
    const fileContent = fs.readFileSync(filePath);
    const response = new HttpResponseOK(fileContent);
  
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');
  
    return response;
  }  
}
