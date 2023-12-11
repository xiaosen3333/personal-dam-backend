import { ApiInfo, ApiServer, Context, controller, Get, HttpResponseOK } from '@foal/core';
import { ImageController, MusicsController, VideoController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
export class ApiController {
  subControllers = [
    controller('/musics', MusicsController),
    controller('/video', VideoController),
    controller('/image', ImageController)
  ];


  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
