// 导入 Music 实体
import { Music } from '../app/entities';
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
    text: { type: 'string', maxLength: 255 }
  },
  required: ['name', 'artist', 'cover', 'url', 'type', 'kind', 'text'],
  type: 'object',
};

// 主函数，用于创建和保存 Music 实体
export async function main(args: {
  name: string,
  artist: string,
  cover: string,
  url: string,
  type: MediaType,
  kind: Kind1 | Kind2,
  text: string
}) {
  await dataSource.initialize();

  const music = new Music();
  music.name = args.name;
  music.artist = args.artist;
  music.cover = args.cover;
  music.url = args.url;
  if (args.type in MediaType) {
    music.type = MediaType[args.type as unknown as keyof typeof MediaType];
  } else {
    throw new Error(`Invalid type: ${args.type}`);
  }
  music.kind = args.kind in Kind1 ? Kind1[args.kind as unknown as keyof typeof Kind1] : Kind2[args.kind as unknown as keyof typeof Kind2];
  music.text = args.text;

  try {
    console.log(await music.save());
  } catch (error: any) {
    console.error(error);
  } finally {
    await dataSource.destroy();
  }
}
