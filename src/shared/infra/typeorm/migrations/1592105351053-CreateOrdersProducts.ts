import { MigrationInterface, QueryRunner, Table } from 'typeorm';

class CreateOrdersProducts1592105351053 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'orders_products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                    },
                    {
                        name: 'price',
                        type: 'numeric',
                    },
                    {
                        name: 'quantity',
                        type: 'integer',
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

                foreignKeys: [
                    {
                        name: 'OrderKey',
                        referencedTableName: 'orders',
                        referencedColumnNames: ['id'],
                        columnNames: ['order_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'ProductKey',
                        referencedTableName: 'products',
                        referencedColumnNames: ['id'],
                        columnNames: ['product_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('orders_products');
    }
}

export default CreateOrdersProducts1592105351053;
