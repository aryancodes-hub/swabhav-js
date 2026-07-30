export class OrderService {
constructor(repository) {
this.repository = repository; // supplied, not created
}
createOrder(order) { return this.repository.save(order); }
}
