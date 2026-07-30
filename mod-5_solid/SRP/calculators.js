export class OrderCalculator {
calculateTotal(items) {
return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
}
