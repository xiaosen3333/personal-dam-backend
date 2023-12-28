import { Context, controller, Hook, HttpResponseNoContent, IAppController, Options } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

@Hook(() => response => {
  response.setHeader('Access-Control-Allow-Origin', '*');
})
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];
  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
    // You may need to allow other headers depending on what you need.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
}
