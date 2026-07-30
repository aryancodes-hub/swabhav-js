export class OrderValidator {
validate(order) {
if (!order.customerEmail) {
throw new Error("Customer email is required");
}
if (!Array.isArray(order.items) || order.items.length === 0) {
throw new Error("Order must contain at least one item");
}
order.items.forEach((item, i) => {
if (!item.name) throw new Error(`Item name is required at index ${i}`);
if (item.price <= 0) throw new Error(`Invalid price at index ${i}`);
if (item.quantity <= 0) throw new Error(`Invalid quantity at index ${i}`);
});
}
}