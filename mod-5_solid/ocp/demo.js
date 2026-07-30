import { CheckoutService } from "./services/CheckoutService.js";
import { UpiPayment } from "./payments/UpiPayment.js";
import { NetBankingPayment } from "./payments/NetBankingPayment.js";
const order = { id: 101, total: 5000 };
new CheckoutService(new UpiPayment()).checkout(order);
new CheckoutService(new NetBankingPayment()).checkout(order);