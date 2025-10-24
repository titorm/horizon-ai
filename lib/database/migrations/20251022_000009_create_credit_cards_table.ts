
import { Kysely, sql } from 'kysely';
import { Migration } from '../migration.interface';

export class CreateCreditCardsTable implements Migration {
  public async up(db: Kysely<any>): Promise<void> {
    await db.schema
      .createTable('credit_cards')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user_id', 'integer', (col) => col.references('users.id').onDelete('cascade').notNull())
      .addColumn('account_id', 'integer', (col) => col.references('accounts.id').onDelete('cascade').notNull())
      .addColumn('name', 'varchar(255)', (col) => col.notNull())
      .addColumn('last_digits', 'varchar(4)', (col) => col.notNull())
      .addColumn('credit_limit', 'decimal(10, 2)', (col) => col.notNull())
      .addColumn('used_limit', 'decimal(10, 2)', (col) => col.notNull().defaultTo(0.0))
      .addColumn('due_day', 'integer', (col) => col.notNull())
      .addColumn('closing_day', 'integer', (col) => col.notNull())
      .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
      .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('credit_cards').execute();
  }
}
