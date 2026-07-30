import { CreditCardPayment, CashOnDeliveryPayment, processPayment, processRefund }
from "./payments/index.js";
const card = new CreditCardPayment();
processPayment(card, 2000);
processRefund(card, 500);
const cod = new CashOnDeliveryPayment();
processPayment(cod, 1500);
// processRefund(cod, 500);