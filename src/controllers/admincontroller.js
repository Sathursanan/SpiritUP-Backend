// import User from '../models/usermodel.js';
// import MentorProfile from '../models/mentorprofilemodel.js';
// import Booking from '../models/bookingmodel.js';
// import Payment from '../models/paymentmodel.js';
// import { MENTOR_STATUS, ROLES } from '../utils/constants.js';

// const admincontroller = {
//   async overview(req, res, next) {
//     try {
//       const totalUsers = await User.countDocuments({ role: ROLES.USER });
//       const totalMentors = await User.countDocuments({ role: ROLES.MENTOR });
//       const totalApprovedMentors = await MentorProfile.countDocuments({
//         status: MENTOR_STATUS.APPROVED,
//       });
//       const totalEarningsAgg = await Payment.aggregate([
//         { $group: { _id: null, total: { $sum: '$amount' } } },
//       ]);
//       const totalEarnings = totalEarningsAgg[0]?.total || 0;
//       const totalBookings = await Booking.countDocuments();

//       res.json({
//         totalUsers,
//         totalMentors,
//         totalApprovedMentors,
//         totalEarnings,
//         totalBookings,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },

//   async listMentors(req, res, next) {
//     try {
//       const mentors = await MentorProfile.find()
//         .populate('user', 'name email role status')
//         .lean();
//       res.json(mentors);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async approveMentor(req, res, next) {
//     try {
//       const { id } = req.params;
//       const profile = await MentorProfile.findById(id);
//       if (!profile) return res.status(404).json({ message: 'Mentor profile not found' });

//       profile.status = MENTOR_STATUS.APPROVED;
//       await profile.save();

//       res.json({ message: 'Mentor approved' });
//     } catch (err) {
//       next(err);
//     }
//   },

//   async deleteMentor(req, res, next) {
//     try {
//       const { id } = req.params;
//       const profile = await MentorProfile.findById(id);
//       if (!profile) return res.status(404).json({ message: 'Mentor profile not found' });

//       profile.status = MENTOR_STATUS.DELETED;
//       await profile.save();

//       await User.findByIdAndUpdate(profile.user, { status: 'BLOCKED' });

//       res.json({ message: 'Mentor deleted/blocked' });
//     } catch (err) {
//       next(err);
//     }
//   },

//   async listUsers(req, res, next) {
//     try {
//       const users = await User.find({ role: ROLES.USER }).select('-password');
//       res.json(users);
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// export default admincontroller;








// src/controllers/admincontroller.js
import User from '../models/usermodel.js';
import MentorProfile from '../models/mentorprofilemodel.js';
import Booking from '../models/bookingmodel.js';
import Payment from '../models/paymentmodel.js';
import { MENTOR_STATUS, ROLES } from '../utils/constants.js';
import mailservice from '../services/mailservice.js';

const admincontroller = {
  async overview(req, res, next) {
    try {
      const totalUsers = await User.countDocuments({ role: ROLES.USER });
      const totalMentors = await User.countDocuments({ role: ROLES.MENTOR });
      const totalApprovedMentors = await MentorProfile.countDocuments({
        status: MENTOR_STATUS.APPROVED,
      });
      const totalEarningsAgg = await Payment.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const totalEarnings = totalEarningsAgg[0]?.total || 0;
      const totalBookings = await Booking.countDocuments();

      res.json({
        totalUsers,
        totalMentors,
        totalApprovedMentors,
        totalEarnings,
        totalBookings,
      });
    } catch (err) {
      next(err);
    }
  },

  async listMentors(req, res, next) {
    try {
      const mentors = await MentorProfile.find()
        .populate('user', 'name email role status')
        .lean();
      res.json(mentors);
    } catch (err) {
      next(err);
    }
  },

  // APPROVE mentor
  async approveMentor(req, res, next) {
    try {
      const { id } = req.params;
      const profile = await MentorProfile.findById(id).populate('user');
      if (!profile) return res.status(404).json({ message: 'Mentor profile not found' });

      profile.status = MENTOR_STATUS.APPROVED;
      await profile.save();

      // send approval email to mentor
      if (profile.user) {
        mailservice
          .sendMentorApprovalEmail(profile.user)
          .catch((err) => console.error('Failed to send mentor approval email:', err));
      }

      res.json({ message: 'Mentor approved' });
    } catch (err) {
      next(err);
    }
  },

  // USED as "reject / delete" mentor
  async deleteMentor(req, res, next) {
    try {
      const { id } = req.params;
      const profile = await MentorProfile.findById(id).populate('user');
      if (!profile) return res.status(404).json({ message: 'Mentor profile not found' });

      profile.status = MENTOR_STATUS.DELETED;
      await profile.save();

      const user = await User.findByIdAndUpdate(
        profile.user._id,
        { status: 'BLOCKED' },
        { new: true }
      );

      // send rejection / blocked email to mentor
      if (user) {
        mailservice
          .sendMentorRejectionEmail(
            user,
            'Your mentor registration/account has been deleted or blocked by the admin.'
          )
          .catch((err) => console.error('Failed to send mentor rejection email:', err));
      }

      res.json({ message: 'Mentor deleted/blocked' });
    } catch (err) {
      next(err);
    }
  },

  async listUsers(req, res, next) {
    try {
      const users = await User.find({ role: ROLES.USER }).select('-password');
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
};

export default admincontroller;