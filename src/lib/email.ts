import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmation = async (booking: any, room: any) => {
  const mailOptions = {
    from: `"Dar Ali Luxury" <${process.env.SMTP_USER}>`,
    to: booking.clientEmail,
    subject: 'Booking Confirmation - Dar Ali Luxury Hotel',
    html: `
      <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fdfbf7; border: 1px solid #e5e1da;">
        <h1 style="color: #1a1a1a; text-align: center; font-size: 32px; letter-spacing: -1px; margin-bottom: 30px;">DAR <span style="color: #c5a059;">ALI</span></h1>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px;">Reservation Confirmed</h2>
          <p style="color: #4a4a4a; line-height: 1.6;">Dear ${booking.clientName},</p>
          <p style="color: #4a4a4a; line-height: 1.6;">Thank you for choosing Dar Ali Luxury. Your reservation for the <strong>${room.name}</strong> has been successfully confirmed.</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #fdfbf7; border-left: 4px solid #c5a059;">
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
            <p style="margin: 5px 0;"><strong>Total Price:</strong> ${booking.totalPrice} TND</p>
          </div>
          
          <p style="color: #4a4a4a; line-height: 1.6;">We look forward to welcoming you to our sanctuary of peace and luxury.</p>
          
          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.APP_URL || '#'}" style="background-color: #c5a059; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Manage Booking</a>
          </div>
        </div>
        <div style="margin-top: 30px; text-align: center; color: #8e8e8e; font-size: 12px;">
          <p>Dar Ali Luxury Hotel & Spa<br>Medina of Tunis, Tunisia</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', booking.clientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
