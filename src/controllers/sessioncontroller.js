// src/controllers/sessioncontroller.js
import Session from "../models/sessionmodel.js";

const sessioncontroller = {
  async getAllSessions(req, res, next) {
    try {
      // only sessions that are not booked/cancelled
      const sessions = await Session.find({ status: 'OPEN' }).populate('mentor');
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },
};

export default sessioncontroller;