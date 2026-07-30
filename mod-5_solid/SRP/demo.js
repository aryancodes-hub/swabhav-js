import { OrderValidator } from "./validators.js";
import { OrderCalculator } from "./calculators.js";
import { OrderRepository } from "./repositories.js";
import { EmailNotification } from "./notifications.js";
import { OrderService } from "./services.js";
const service = new OrderService(
new OrderValidator(),
new OrderCalculator(),
new OrderRepository(),
new EmailNotification()
);
const order = service.createOrder({
customerEmail: "amit@example.com",
items: [{ name: "Laptop", price: 50000, quantity: 1 }]
});
console.log("Saved order total:", order.total);
