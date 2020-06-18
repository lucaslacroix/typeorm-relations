import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProduct[];
}

@injectable()
class CreateOrderService {
    constructor(
        @inject('OrdersRepository')
        private ordersRepository: IOrdersRepository,

        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,

        @inject('CustomerRepository')
        private customersRepository: ICustomersRepository,
    ) {}

    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const customer = await this.customersRepository.findById(customer_id);

        if (!customer) {
            throw new AppError('Você precisa se cadastrar antes');
        }

        const findProducts = await this.productsRepository.findAllById(
            products,
        );

        for (const prod of products) {
            const product = findProducts.find(p => p.id === prod.id);

            if (!product) {
                throw new AppError('Esse Produto não existe');
            }

            if (product.quantity < prod.quantity) {
                throw new AppError('Sem estoque');
            }
        }

        await this.productsRepository.updateQuantity(products);

        const orderedProducts = findProducts.map(prod => {
            const product = products.find(p => prod.id === p.id);

            return {
                product_id: prod.id,
                price: prod.price,
                quantity: product?.quantity || 1,
            };
        });

        const order = await this.ordersRepository.create({
            customer,
            products: orderedProducts,
        });

        const findOrder = await this.ordersRepository.findById(order.id);

        return findOrder || order;
    }
}

export default CreateOrderService;
