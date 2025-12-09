import User from '../models/usermodel.js';
import Booking from '../models/bookingmodel.js';
import Session from '../models/sessionmodel.js'; 
const usercontroller = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async myBookings(req, res, next) {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate('session')
        .sort({ createdAt: -1 });
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  },
  async listSessions(req, res, next) {
    try {
      const { mentorId } = req.query; // optional filter by mentor

      const query = { status: 'OPEN' }; // only open sessions
      if (mentorId) {
        query.mentor = mentorId;
      }

      const sessions = await Session.find(query)
        .populate('mentor', 'name email')   // show mentor basic info
        .sort({ startTime: 1 });            // upcoming first

      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },
};

export default usercontroller;
