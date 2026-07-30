export class CreditCardPayment {
pay(amount) { console.log(`Paid Rs. ${amount} via credit card`); }
refund(amount) { console.log(`Refunded Rs. ${amount} to card`); }
}
export class CashOnDeliveryPayment {
pay(amount) { console.log(`Rs. ${amount} will be collected on delivery`); }
// no refund() — and that's fine, it's simply not offered by this method
}
// Functions ask only for the capability they actually need:
export function processPayment(method, amount) { method.pay(amount); }
export function processRefund(method, amount) {
if (typeof method.refund !== "function") {
throw new Error(`${method.constructor.name} does not support refunds`);
}
method.refund(amount);
}
