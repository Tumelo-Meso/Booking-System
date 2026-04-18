import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "s1.ahmail.co.za",
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


export async function sendOTPEmail(email, otp){
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification Code",
        
    }
    

    await transporter.sendMail(mailOptions)
}
