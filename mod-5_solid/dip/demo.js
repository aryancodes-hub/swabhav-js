import { OrderService } from "./services/OrderService.js";
import { MongoOrderRepository } from "./repositories/MongoOrderRepository.js";
import { FileOrderRepository } from "./repositories/FileOrderRepository.js";
const mongoService = new OrderService(new MongoOrderRepository());
mongoService.createOrder({ id: 1, total: 500 });
// Swapping storage requires zero changes inside OrderService:
const fileService = new OrderService(new FileOrderRepository());
fileService.createOrder({ id: 2, total: 750 });
