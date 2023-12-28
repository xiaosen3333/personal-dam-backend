import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702213513029 implements MigrationInterface {
    name = 'Migration1702213513029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "video" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "artist" varchar NOT NULL,
                "cover" varchar NOT NULL,
                "url" varchar NOT NULL,
                "type" integer NOT NULL,
                "kind" integer NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "video"
        `);
    }

}
