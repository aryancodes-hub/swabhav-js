export class OrderService {
constructor(validator, calculator, repository, notification) {
this.validator = validator;
this.calculator = calculator;
this.repository = repository;
this.notification = notification;
}
createOrder(orderData) {
this.validator.validate(orderData);
const total = this.calculator.calculateTotal(orderData.items);
const order = { ...orderData, id: Date.now(), total };
const saved = this.repository.save(order);
this.notification.send(saved);
return saved;
}
}