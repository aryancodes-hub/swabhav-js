export class OrderEmailService {
constructor(emailSender) {
if (typeof emailSender?.sendEmail !== "function") {
throw new TypeError("emailSender must implement sendEmail(message)");
}
this.emailSender = emailSender;
}
sendConfirmation(order) {
this.emailSender.sendEmail(`Order ${order.id} confirmed`);
}
}
