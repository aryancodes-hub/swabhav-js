export class NetBankingPayment {
process(amount) {
console.log(`Processing Rs. ${amount} through net banking`);
return { success: true, method: "net-banking", amount };
}
}
