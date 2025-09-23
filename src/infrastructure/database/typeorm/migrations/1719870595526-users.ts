import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Users1719870595526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'access_role',
            type: 'enum',
            enum: ['admin', 'default'],
            default: "'default'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
