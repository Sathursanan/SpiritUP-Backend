import MentorProfile from '../models/mentorprofilemodel.js';
import Session from '../models/sessionmodel.js';
import Booking from '../models/bookingmodel.js';

const mentorcontroller = {
  async getProfile(req, res, next) {
    try {
      const profile = await MentorProfile.findOne({ user: req.user.id });
      res.json(profile);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { bio, expertise, priceDefault } = req.body;
      const profile = await MentorProfile.findOneAndUpdate(
        { user: req.user.id },
        { bio, expertise, priceDefault },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      next(err);
    }
  },

  async createSession(req, res, next) {
    try {
      const { title, description, startTime, durationMinutes, price } = req.body;
      const session = await Session.create({
        mentor: req.user.id,
        title,
        description,
        startTime,
        durationMinutes,
        price,
      });
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },

  async mySessions(req, res, next) {
    try {
      const sessions = await Session.find({ mentor: req.user.id });
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },

  async myBookings(req, res, next) {
    try {
      const bookings = await Booking.find()
        .populate({
          path: 'session',
          match: { mentor: req.user.id },
        })
        .populate('user', 'name email');

      res.json(bookings.filter((b) => b.session)); // only mentor's
    } catch (err) {
      next(err);
    }
  },
};

export default mentorcontroller;
