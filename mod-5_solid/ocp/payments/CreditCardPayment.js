export class CreditCardPayment {
process(amount) {
console.log(`Processing Rs. ${amount} through credit card`);
return { success: true, method: "credit-card", amount };
}
}
