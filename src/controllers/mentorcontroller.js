// import MentorProfile from '../models/mentorprofilemodel.js';
// import Session from '../models/sessionmodel.js';
// import Booking from '../models/bookingmodel.js';

// const mentorcontroller = {
//   async getProfile(req, res, next) {
//     try {
//       const profile = await MentorProfile.findOne({ user: req.user.id });
//       res.json(profile);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async updateProfile(req, res, next) {
//     try {
//       const { bio, expertise, priceDefault } = req.body;
//       const profile = await MentorProfile.findOneAndUpdate(
//         { user: req.user.id },
//         { bio, expertise, priceDefault },
//         { new: true, upsert: true }
//       );
//       res.json(profile);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async createSession(req, res, next) {
//     try {
//       const { title, description, startTime, durationMinutes, price } = req.body;
//       const session = await Session.create({
//         mentor: req.user.id,
//         title,
//         description,
//         startTime,
//         durationMinutes,
//         price,
//       });
//       res.status(201).json(session);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async mySessions(req, res, next) {
//     try {
//       const sessions = await Session.find({ mentor: req.user.id });
//       res.json(sessions);
//     } catch (err) {
//       next(err);
//     }
//   },

  

//   async myBookings(req, res, next) {
//     try {
//       const bookings = await Booking.find()
//         .populate({
//           path: 'session',
//           match: { mentor: req.user.id },
//         })
//         .populate('user', 'name email');

//       res.json(bookings.filter((b) => b.session)); // only mentor's
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// export default mentorcontroller;


// src/controllers/mentorcontroller.js
import MentorProfile from "../models/mentorprofilemodel.js";
import Session from "../models/sessionmodel.js";
import Booking from "../models/bookingmodel.js";

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
      const { title, description, startTime, durationMinutes, price } =
        req.body;
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

  // // ✅ simplified deleteSession for debugging
  // async deleteSession(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     console.log("🗑 deleteSession called with id =", id);

  //     const session = await Session.findByIdAndDelete(id);

  //     if (!session) {
  //       console.log("⚠️ Session not found in DB for id", id);
  //       return res.status(404).json({ message: "Session not found" });
  //     }

  //     console.log("✅ Session deleted:", id);
  //     return res.json({ message: "Session deleted successfully" });
  //   } catch (err) {
  //     console.error("❌ Error deleting session:", err);
  //     next(err);
  //   }
  // },

  // ✅ Only the owning mentor can delete this session
async deleteSession(req, res, next) {
  try {
    const { id } = req.params;
    console.log(
      "🗑 deleteSession called with id =",
      id,
      "by user =",
      req.user.id
    );

    // Find the session first
    const session = await Session.findById(id);

    if (!session) {
      console.log("⚠️ Session not found in DB for id", id);
      return res.status(404).json({ message: "Session not found" });
    }

    // Check ownership: only the mentor who created it can delete
    if (session.mentor.toString() !== req.user.id.toString()) {
      console.log(
        "⚠️ Unauthorized delete attempt. session.mentor =",
        session.mentor.toString(),
        "req.user.id =",
        req.user.id.toString()
      );
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this session" });
    }

    // Now it's safe to delete
    await session.deleteOne();

    console.log("✅ Session deleted:", id);
    return res.json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting session:", err);
    next(err);
  }
},

  async myBookings(req, res, next) {
    try {
      const bookings = await Booking.find()
        .populate({
          path: "session",
          match: { mentor: req.user.id },
        })
        .populate("user", "name email");

      res.json(bookings.filter((b) => b.session)); // only mentor's
    } catch (err) {
      next(err);
    }
  },
};

export default mentorcontroller;