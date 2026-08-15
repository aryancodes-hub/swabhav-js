const crypto = require("crypto");

class PaymentGateway {
  /**
   * DUMMY MODE (Current): Instantly approves payment synchronously
   */
  static async processDummyPayment(amount) {
    return {
      status: "SUCCESS",
      transactionId: `DUMMY_TXN_${Date.now()}`
    };
  }

  /**
   * RAZORPAY MODE (Future): Step 1 - Creates Razorpay Order
   */
  static async createRazorpayOrder(razorpayInstance, { amount, currency = "INR", receipt }) {
    const options = {
      amount: Math.round(amount * 100), 
      currency,
      receipt
    };
    // Razorpay SDK method
    return await razorpayInstance.orders.create(options);
  }

  /**
   * RAZORPAY MODE (Future): Step 2 - Cryptographic Signature Verification
   */
  static verifyRazorpaySignature({ orderId, paymentId, signature }, secret) {
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  }
}

module.exports = PaymentGateway;