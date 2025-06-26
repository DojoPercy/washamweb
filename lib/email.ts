import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewOrderNotification(orderData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: "WashAm <orders@washam.com>",
      to: [process.env.ADMIN_EMAIL!],
      subject: `🚨 New Order Alert - ${orderData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">🧺 New WashAm Order</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e3a5f; margin-top: 0;">Order Details</h2>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Customer:</strong> ${orderData.customerName}</p>
              <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
              <p><strong>Email:</strong> ${orderData.customerEmail || "Not provided"}</p>
              <p><strong>Address:</strong> ${orderData.customerAddress}</p>
              <p><strong>Pickup Date:</strong> ${orderData.pickupDate}</p>
              <p><strong>Pickup Time:</strong> ${orderData.pickupTime || "Any time"}</p>
              <p><strong>Total Amount:</strong> ₵${orderData.total}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e3a5f; margin-top: 0;">Services Requested</h3>
              ${orderData.services
                .map(
                  (service: any) => `
                <p>• ${service.service} × ${service.quantity} - ₵${service.price * service.quantity}</p>
              `,
                )
                .join("")}
            </div>
            
            ${
              orderData.instructions
                ? `
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3 style="color: #1e3a5f; margin-top: 0;">Special Instructions</h3>
                <p>${orderData.instructions}</p>
              </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b;">Order placed at ${new Date(orderData.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error }
  }
}
