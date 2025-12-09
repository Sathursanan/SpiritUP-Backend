import transporter from '../config/mailerconfig.js';
import dotenv from 'dotenv';

dotenv.config();

const mailservice = {
  async sendOtpEmail(to, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Grow - Password Reset OTP',
      text: `Your OTP for resetting password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  },
};

export default mailservice;
