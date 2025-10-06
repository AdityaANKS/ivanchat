const axios = require('axios');
const crypto = require('crypto');

class WebhookSimulator {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async simulateRazorpayWebhook(data) {
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: data.paymentId || 'pay_test123',
            amount: data.amount * 100, // Convert to paise
            currency: 'INR',
            status: 'captured',
            method: 'upi',
            notes: {
              transactionRef: data.transactionRef
            }
          }
        }
      }
    };

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return axios.post(
      `${this.baseUrl}/webhooks/payments/razorpay`,
      payload,
      {
        headers: {
          'x-razorpay-signature': signature
        }
      }
    );
  }

  async simulateUPIPayment(data) {
    // Simulate delay for UPI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return this.simulateRazorpayWebhook(data);
  }

  async simulateFailedPayment(data) {
    const payload = {
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: data.paymentId || 'pay_failed123',
            amount: data.amount * 100,
            status: 'failed',
            error_code: 'BAD_REQUEST_ERROR',
            error_description: 'Payment failed',
            notes: {
              transactionRef: data.transactionRef
            }
          }
        }
      }
    };

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return axios.post(
      `${this.baseUrl}/webhooks/payments/razorpay`,
      payload,
      {
        headers: {
          'x-razorpay-signature': signature
        }
      }
    );
  }
}

module.exports = new WebhookSimulator();
module.exports.WebhookSimulator = WebhookSimulator;