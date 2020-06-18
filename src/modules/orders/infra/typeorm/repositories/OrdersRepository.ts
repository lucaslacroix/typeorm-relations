import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
    private ormRepository: Repository<Order>;

    private orderProductsRepository: Repository<OrdersProducts>;

    constructor() {
        this.ormRepository = getRepository(Order);
        this.orderProductsRepository = getRepository(OrdersProducts);
    }

    public async create({
        customer,
        products,
    }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            customer,
        });

        await this.ormRepository.save(order);

        const orderProducts = products.map(product =>
            this.orderProductsRepository.create({
                order_id: order.id,
                product_id: product.product_id,
                price: product.price,
                quantity: product.quantity,
            }),
        );

        await this.orderProductsRepository.save(orderProducts);

        // const findOrder = await this.ormRepository.findOne({
        //     relations: ['order_products', 'customer'],
        //     where: {
        //         id: order.id,
        //     },
        //     select: [
        //         'customer.email',
        //         'customer.id',
        //         'customer.name',
        //         'order_products.price',
        //         'order_products.product_id',
        //         'order_products.quantity',
        //     ],
        // });

        return order;
    }

    public async findById(id: string): Promise<Order | undefined> {
        const findOrder = await this.ormRepository.findOne({
            relations: ['order_products', 'customer'],
            where: {
                id,
            },
        });

        return findOrder;
    }
}

export default OrdersRepository;
