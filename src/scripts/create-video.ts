// 导入 Video 实体
import { Video } from '../app/entities';
import { dataSource } from '../db';
import { MediaType, Kind1, Kind2 } from '../app/entities'; 

// 定义输入 schema
export const schema = {
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 255 },
    artist: { type: 'string', maxLength: 255 },
    cover: { type: 'string', maxLength: 255 },
    url: { type: 'string', maxLength: 255 },
    type: { type: 'string' }, // 或者您可以定义更具体的 schema
    kind: { type: 'string' }, // 根据 Kind1 和 Kind2 的定义调整
  },
  required: ['name', 'artist', 'cover', 'url', 'type', 'kind'],
  type: 'object',
};

// 主函数，用于创建和保存 Video 实体
export async function main(args: {
  name: string,
  artist: string,
  cover: string,
  url: string,
  type: MediaType,
  kind: Kind1 | Kind2,
}) {
  await dataSource.initialize();

  const video = new Video();
  video.name = args.name;
  video.artist = args.artist;
  video.cover = args.cover;
  video.url = args.url;
  if (args.type in MediaType) {
    video.type = MediaType[args.type as unknown as keyof typeof MediaType];
  } else {
    throw new Error(`Invalid type: ${args.type}`);
  }
  video.kind = args.kind in Kind1 ? Kind1[args.kind as unknown as keyof typeof Kind1] : Kind2[args.kind as unknown as keyof typeof Kind2];
  try {
    console.log(await video.save());
  } catch (error: any) {
    console.error(error);
  } finally {
    await dataSource.destroy();
  }
}
