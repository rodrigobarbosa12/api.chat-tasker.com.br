import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class Tasks1758580150462 implements MigrationInterface {
  name = 'Tasks1758580150462'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extensões necessárias
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`)

    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'original_text',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'text',
            default: "'open'",
          },
          {
            name: 'priority',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'priority_score',
            type: 'real',
            isNullable: true,
          },
          {
            name: 'priority_explain',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'embedding',
            type: 'vector(1536)',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'integer',
          },
          {
            name: 'updated_by',
            type: 'integer',
          },
        ],
      }),
      true,
    )

    // FK para users
    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    )

    // Índices
    await queryRunner.query(
      `CREATE INDEX "idx_tasks_embedding" ON "tasks" USING ivfflat ("embedding") WITH (lists=100)`,
    )
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'idx_tasks_status',
        columnNames: ['status'],
      }),
    )
    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'idx_tasks_priority',
        columnNames: ['priority'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tasks', 'idx_tasks_priority')
    await queryRunner.dropIndex('tasks', 'idx_tasks_status')
    await queryRunner.query(`DROP INDEX "idx_tasks_embedding"`)
    await queryRunner.dropTable('tasks')
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector`)
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pg_trgm"`)
  }
}
