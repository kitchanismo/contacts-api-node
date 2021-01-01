import { MigrationInterface, QueryRunner } from 'typeorm'

export class addBookModel1609454973276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE book ADD COLUMN price int`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
