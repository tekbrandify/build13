interface OrderData {
  id: string;
  orderNumber: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  discount?: {
    code: string;
    discountAmount: number;
  };
}

export class InvoiceGenerator {
  /**
   * Generate invoice HTML
   */
  static generateHTML(order: OrderData): string {
    const invoiceDate = new Date(order.createdAt).toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

    const itemsHTML = order.items
      .map(
        (item) =>
          `
          <tr>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">₦${item.price.toLocaleString()}</td>
            <td style="text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `
      )
      .join("");

    const subtotalAfterDiscount = order.discount
      ? order.subtotal - order.discount.discountAmount
      : order.subtotal;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 30px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
          }
          .company-info h1 {
            margin: 0;
            color: #007bff;
            font-size: 28px;
          }
          .company-info p {
            margin: 5px 0;
            font-size: 12px;
          }
          .invoice-info {
            text-align: right;
          }
          .invoice-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          .invoice-no {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
          }
          .section-title {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .address-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .address-block {
            font-size: 12px;
          }
          .address-block strong {
            display: block;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          table thead {
            background-color: #f8f9fa;
            border-bottom: 2px solid #007bff;
          }
          table th {
            padding: 10px;
            text-align: left;
            font-weight: bold;
          }
          table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .totals {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
          .totals-table {
            width: 300px;
          }
          .totals-table tr td {
            border: none;
            padding: 8px;
          }
          .totals-table tr td:first-child {
            font-weight: bold;
            text-align: right;
            width: 150px;
          }
          .totals-table tr td:last-child {
            text-align: right;
            font-weight: bold;
            width: 150px;
          }
          .discount-row {
            color: #28a745;
          }
          .total-row {
            border-top: 2px solid #007bff;
            font-size: 16px;
            color: #007bff;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .payment-status {
            background-color: #fff3cd;
            padding: 10px;
            border-radius: 4px;
            margin-top: 20px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>TradeHub</h1>
              <p>Your trusted e-commerce platform</p>
              <p>support@tradehub.com</p>
              <p>+234 (0) 123 456 7890</p>
            </div>
            <div class="invoice-info">
              <p class="invoice-no">Invoice #${order.orderNumber}</p>
              <p>Invoice Date: ${invoiceDate}</p>
              <p>Due Date: ${dueDate}</p>
            </div>
          </div>

          <div class="address-columns">
            <div class="address-block">
              <div class="section-title">Bill To</div>
              <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
              <p>Email: ${order.shippingAddress.email}</p>
              <p>Phone: ${order.shippingAddress.phone}</p>
            </div>
            <div class="address-block">
              <div class="section-title">Ship To</div>
              <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            </div>
          </div>

          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td>₦${order.subtotal.toLocaleString()}</td>
              </tr>
              ${
                order.discount
                  ? `
                <tr class="discount-row">
                  <td>${order.discount.code} Discount:</td>
                  <td>-₦${order.discount.discountAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Subtotal after discount:</td>
                  <td>₦${subtotalAfterDiscount.toLocaleString()}</td>
                </tr>
              `
                  : ""
              }
              <tr>
                <td>Shipping:</td>
                <td>₦${order.shipping.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Tax (7.5%):</td>
                <td>₦${order.tax.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Total Due:</td>
                <td>₦${order.total.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div class="payment-status">
            <strong>Payment Status:</strong> Pending<br>
            <strong>Payment Method:</strong> OPay<br>
            Thank you for your order! Please proceed with payment to complete your purchase.
          </div>

          <div class="footer">
            <p>Thank you for shopping with TradeHub!</p>
            <p>For questions about this invoice, contact support@tradehub.com</p>
            <p style="margin-top: 10px; font-size: 10px;">
              This is an automatically generated invoice. No signature is required.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate invoice as plain text
   */
  static generatePlainText(order: OrderData): string {
    const invoiceDate = new Date(order.createdAt).toLocaleDateString();
    const separator = "-".repeat(80);

    let text = `
${separator}
INVOICE #${order.orderNumber}
${separator}

INVOICE DATE: ${invoiceDate}
ORDER NUMBER: ${order.orderNumber}

${separator}
BILL TO:
${separator}
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
Email: ${order.shippingAddress.email}
Phone: ${order.shippingAddress.phone}

${separator}
ORDER ITEMS:
${separator}
Description                          Qty    Price         Amount
${separator}
`;

    order.items.forEach((item) => {
      const amount = item.price * item.quantity;
      text += `${item.name.padEnd(36)} ${String(item.quantity).padStart(3)} ₦${String(item.price).padStart(9)} ₦${String(amount).padStart(9)}\n`;
    });

    text += `
${separator}
SUBTOTAL:                                              ₦${String(order.subtotal).padStart(9)}
`;

    if (order.discount) {
      text += `${order.discount.code} DISCOUNT:                                  -₦${String(order.discount.discountAmount).padStart(8)}
SUBTOTAL AFTER DISCOUNT:                           ₦${String(order.subtotal - order.discount.discountAmount).padStart(9)}
`;
    }

    text += `SHIPPING:                                            ₦${String(order.shipping).padStart(9)}
TAX (7.5%):                                          ₦${String(order.tax).padStart(9)}
${separator}
TOTAL DUE:                                           ₦${String(order.total).padStart(9)}
${separator}

PAYMENT STATUS: Pending
PAYMENT METHOD: OPay

Thank you for your order!
For questions, contact support@tradehub.com

This is an automatically generated invoice.
`;

    return text;
  }
}
