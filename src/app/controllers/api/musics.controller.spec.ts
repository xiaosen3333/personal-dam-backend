// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { MusicsController } from './musics.controller';

describe('MusicsController', () => {

  let controller: MusicsController;

  beforeEach(() => controller = createController(MusicsController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(MusicsController, 'foo'), 'GET');
      strictEqual(getPath(MusicsController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
