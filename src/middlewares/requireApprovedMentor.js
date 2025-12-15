// src/middlewares/requireApprovedMentor.js
import MentorProfile from '../models/mentorprofilemodel.js';
import { MENTOR_STATUS } from '../utils/constants.js';

const requireApprovedMentor = async (req, res, next) => {
  try {
    // authmiddleware already set req.user
    const userId = req.user.id; // same as you use in usercontroller.me

    const profile = await MentorProfile.findOne({ user: userId });

    // If no profile or not approved → block
    if (!profile || profile.status !== MENTOR_STATUS.APPROVED) {
      return res
        .status(403)
        .json({ message: 'Your mentor account is not approved by admin yet' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default requireApprovedMentor;