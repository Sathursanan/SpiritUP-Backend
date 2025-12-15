// import authservice from '../services/authservice.js';
// import MentorProfile from '../models/mentorprofilemodel.js';

// const authcontroller = {
//   // User registration
//   async registerUser(req, res, next) {
//     try {
//       const { name, email, password } = req.body;
//       const { user, token } = await authservice.registerUser({ name, email, password });
//       res.status(201).json({ user, token });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Mentor registration
//   async registerMentor(req, res, next) {
//     try {
//       const { name, email, password } = req.body;
//       const user = await authservice.registerMentor({ name, email, password });
//       await MentorProfile.create({ user: user._id }); // status PENDING
//       res.status(201).json({ message: 'Mentor registered, pending admin approval' });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Login (user or mentor)
//   async login(req, res, next) {
//     try {
//       const { email, password } = req.body;
//       const { user, token } = await authservice.login({ email, password });
//       res.json({ user, token });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Forgot password - send OTP
//   async forgotPassword(req, res, next) {
//     try {
//       const { email } = req.body;
//       await authservice.createOtp(email);
//       res.json({ message: 'OTP sent to email' });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Reset password
//   async resetPassword(req, res, next) {
//     try {
//       const { email, otp, newPassword } = req.body;
//       await authservice.resetPassword({ email, otp, newPassword });
//       res.json({ message: 'Password reset successful' });
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// export default authcontroller;




// src/controllers/authcontroller.js
import authservice from '../services/authservice.js';
import MentorProfile from '../models/mentorprofilemodel.js';
import mailservice from '../services/mailservice.js'; // used in registerMentor

const authcontroller = {
  // User registration
  async registerUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await authservice.registerUser({ name, email, password });
      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  },

  // Mentor registration
  async registerMentor(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await authservice.registerMentor({ name, email, password });

      // create MentorProfile, default status = PENDING
      await MentorProfile.create({ user: user._id });

      // notify admin about new mentor
      mailservice
        .sendAdminNewMentorEmail(user)
        .catch((err) => console.error('Failed to send admin mentor email:', err));

      res
        .status(201)
        .json({ message: 'Mentor registered, pending admin approval' });
    } catch (err) {
      next(err);
    }
  },

  // Login (user, mentor, admin)
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authservice.login({ email, password });

      console.log('Login attempt:', user.email, 'role:', user.role);

      // Only apply approval check to mentors
      if (user.role === 'MENTOR') {
        const profile = await MentorProfile.findOne({ user: user._id });

        // If no profile or not approved -> block
        if (!profile || profile.status !== 'APPROVED') {
          return res
            .status(403)
            .json({ message: 'Your mentor account is pending admin approval' });
        }
      }

      // USERS and ADMINS (and APPROVED mentors) can login normally
      return res.json({ user, token });
    } catch (err) {
      console.error('Error in authcontroller.login:', err);
      next(err); // your global error handler will send 500
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authservice.createOtp(email);
      res.json({ message: 'OTP sent to email' });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      await authservice.resetPassword({ email, otp, newPassword });
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      next(err);
    }
  },
};

export default authcontroller;