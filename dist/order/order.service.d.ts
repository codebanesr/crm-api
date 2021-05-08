import { CreateOrderDto } from "./dto/CreateOrder.dto";
import { AxiosInstance } from "axios";
export declare class OrderService {
    axiosInstance: AxiosInstance;
    constructor();
    createOrder(orderDto: CreateOrderDto): Promise<any>;
}
