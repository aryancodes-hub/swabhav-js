export class UpiPayment {
process(amount) {
console.log(`Processing Rs. ${amount} through UPI`);
return { success: true, method: "upi", amount };
}
}
