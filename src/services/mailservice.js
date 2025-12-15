// import transporter from '../config/mailerconfig.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const mailservice = {
//   async sendOtpEmail(to, otp) {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject: 'Grow - Password Reset OTP',
//       text: `Your OTP for resetting password is: ${otp}`,
//     };

//     await transporter.sendMail(mailOptions);
//   },
// };

// export default mailservice;





// src/services/mailservice.js
import transporter from '../config/mailerconfig.js';
import dotenv from 'dotenv';

dotenv.config();

const FROM_EMAIL = process.env.EMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // add this in your .env

const mailservice = {
  // existing OTP email
  async sendOtpEmail(to, otp) {
    const mailOptions = {
      from: FROM_EMAIL,
      to,
      subject: 'Grow - Password Reset OTP',
      text: `Your OTP for resetting password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  },

  // 1) New mentor registered → notify admin
  async sendAdminNewMentorEmail(mentorUser) {
    if (!ADMIN_EMAIL) {
      console.warn('ADMIN_EMAIL not set, cannot send admin notification');
      return;
    }

    const mailOptions = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'Grow - New mentor registration pending approval',
      text: `
A new mentor has registered.

Name: ${mentorUser.name}
Email: ${mentorUser.email}
User ID: ${mentorUser._id}

Please log in to the admin panel to approve or reject this mentor.
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
  },

  // 2a) Mentor approved → send email to mentor
  async sendMentorApprovalEmail(mentorUser) {
    const mailOptions = {
      from: FROM_EMAIL,
      to: mentorUser.email,
      subject: 'Grow - Your mentor registration has been approved',
      text: `
Hi ${mentorUser.name},

Your mentor registration has been APPROVED.

You can now log in to Grow as a mentor and start creating sessions.

Best regards,
Grow Team
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
  },

  // 2b) Mentor rejected / deleted → send email to mentor
  async sendMentorRejectionEmail(mentorUser, reason) {
    const mailOptions = {
      from: FROM_EMAIL,
      to: mentorUser.email,
      subject: 'Grow - Your mentor registration has been rejected',
      text: `
Hi ${mentorUser.name},

Your mentor registration has been REJECTED / your mentor account has been disabled by the admin.
${reason ? `Reason: ${reason}\n` : ''}

If you believe this is a mistake or have questions, please contact support.

Best regards,
Grow Team
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
  },

  // 3) After payment confirmed → emails to mentor and user
  async sendSessionBookedEmails({
    mentorEmail,
    mentorName,
    userEmail,
    userName,
    sessionTitle,
    sessionStartTime,
    durationMinutes,
    price,
  }) {
    const dateTimeString = new Date(sessionStartTime).toLocaleString();

    // Email to mentor
    const mentorMail = {
      from: FROM_EMAIL,
      to: mentorEmail,
      subject: 'Grow - Your session has been booked (payment successful)',
      text: `
Hi ${mentorName},

Your session "${sessionTitle}" has been booked.

User: ${userName} (${userEmail})
Date & Time: ${dateTimeString}
Duration: ${durationMinutes} minutes
Amount: LKR ${price}

Payment is SUCCESSFUL and the session is CONFIRMED.

Best regards,
Grow Team
      `.trim(),
    };

    // Email to user
    const userMail = {
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'Grow - Your session booking is confirmed',
      text: `
Hi ${userName},

Your session booking is CONFIRMED and payment is SUCCESSFUL.

Session: ${sessionTitle}
Mentor: ${mentorName} (${mentorEmail})
Date & Time: ${dateTimeString}
Duration: ${durationMinutes} minutes
Amount paid: LKR ${price}

Thank you for using Grow.

Best regards,
Grow Team
      `.trim(),
    };

    await transporter.sendMail(mentorMail);
    await transporter.sendMail(userMail);
  },
};

export default mailservice;