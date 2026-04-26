import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

export async function sendBookingConfirmation(email , data){
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Booking Confirmation",
        html: bookingEmailTemplate(data)
        
    }
    

    await transporter.sendMail(mailOptions)
}

function bookingEmailTemplate(data) {
  return `
  <html>
  <body style="font-family: Arial; background:#0f0f0f; color:#fff; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#1a1a1a; border-radius:10px; overflow:hidden;">
      
      <div style="padding:20px; text-align:center; background:#111;">
        <h1 style="color:#FFD700;">Pure Ink Co.</h1>
        <p>Booking Confirmation</p>
      </div>

      <div style="padding:20px;">
        <p>Hi <b>${data.firstName} ${data.lastName}</b>,</p>

        <p>Your booking has been received. Here are your details:</p>

        <table width="100%" style="margin-top:10px;">
       
          <tr><td>Service:</td><td align="right">${data.serviceType}</td></tr>
            <tr><td>Placement:</td><td align="right">${data.tattoPlacement}</td></tr>
           <tr><td>Description:</td><td align="right">${data.tattoDescription}</td></tr>
          <tr><td>Size:</td><td align="right">${data.tattoSize}</td></tr>
          <tr><td>Date:</td><td align="right">${data.preferredDate}</td></tr>
          <tr><td>Time:</td><td align="right">${data.preferredTime}</td></tr>
          
          <tr><td>Status:</td><td align="right" style="color:#ffa424;">Pending</td></tr>

        </table>

        <p style="margin-top:20px;">
          We’ll review your request and confirm soon.
        </p>
      </div>

      <div style="padding:15px; text-align:center; background:#111; font-size:12px;">
        <p>Pure Ink Co.</p>
      </div>

    </div>

  </body>
  </html>
  `;
}

