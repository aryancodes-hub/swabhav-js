export class CheckoutService {
constructor(paymentMethod) { this.paymentMethod = paymentMethod; }
checkout(order) { return this.paymentMethod.process(order.total); }
}