const crypto = require("crypto");
const Razorpay = require("razorpay");

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
  static async createRazorpayOrder({ amount, currency = "INR", receipt }={}) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if(!key_id || !key_secret){
      throw new Error("RazorPay credentials are missing.")
    }

    const razorpay = new Razorpay({key_id, key_secret});

    const options = {
      amount: Math.round(amount * 100), 
      currency,
      receipt: String(receipt),
      payment_capture: 1
    };
    // Razorpay SDK method
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      keyId: key_id
    };
  }

  /**
   * RAZORPAY MODE : Step 2 - Cryptographic Signature Verification
   */
  static verifyRazorpaySignature({ orderId, paymentId, signature }) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if(!secret){
      throw new Error("RAZORPAY_KEY_SECRET is missing.")
    }
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  }
}

module.exports = PaymentGateway;