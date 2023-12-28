// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MediaType , Kind1} from "./index";
@Entity()
export class Video extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  cover: string;

  @Column()
  url: string;

  @Column()
  type: MediaType;

  @Column()
  kind: Kind1 ;
}
