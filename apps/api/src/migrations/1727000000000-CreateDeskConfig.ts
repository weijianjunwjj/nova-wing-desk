import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeskConfig1727000000000 implements MigrationInterface {
  name = 'CreateDeskConfig1727000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "desk_config" (
        "key" text PRIMARY KEY,
        "value" jsonb NOT NULL,
        "revision" integer NOT NULL CHECK ("revision" >= 0),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "desk_config"');
  }
}
